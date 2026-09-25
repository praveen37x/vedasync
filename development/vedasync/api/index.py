"""
Vedasync Vercel Serverless API Handler
Compatible with Vercel Python Serverless Runtime & Local Execution
"""

from http.server import BaseHTTPRequestHandler
import json
import sqlite3
import os
import shutil
import tempfile
import urllib.parse
import hashlib

# ----------------------------------------------------------------------
# 1. DATABASE CONFIGURATION (Serverless Safe)
# ----------------------------------------------------------------------

def get_db_path():
    """
    Determines the appropriate SQLite database location.
    In Vercel / AWS Lambda serverless environments, the project folder
    is strictly read-only. We use /tmp which is writable.
    """
    is_serverless = (
        os.environ.get('VERCEL') == '1'
        or os.environ.get('AWS_LAMBDA_FUNCTION_NAME') is not None
        or not os.access('.', os.W_OK)
    )

    if is_serverless:
        tmp_dir = os.environ.get('TMPDIR', tempfile.gettempdir())
        target_path = os.path.join(tmp_dir, 'vedasync_active.db')
        
        # Copy starter database if target does not yet exist in /tmp
        if not os.path.exists(target_path):
            candidates = [
                os.path.join(os.path.dirname(__file__), '..', 'vedasync_active.db'),
                os.path.join(os.path.dirname(__file__), 'vedasync_active.db'),
                os.path.abspath('vedasync_active.db'),
                os.path.join(os.path.dirname(__file__), '..', 'vedasync.db'),
                os.path.abspath('vedasync.db'),
            ]
            for src in candidates:
                if os.path.exists(src):
                    try:
                        shutil.copyfile(src, target_path)
                        break
                    except Exception:
                        pass
        return target_path
    else:
        # Running locally in writable folder
        local_candidates = [
            'vedasync_active.db',
            os.path.join(os.path.dirname(__file__), '..', 'vedasync_active.db'),
            os.path.join(os.path.dirname(__file__), 'vedasync_active.db'),
        ]
        for path in local_candidates:
            if os.path.exists(path):
                return os.path.abspath(path)
        return 'vedasync_active.db'

def get_db_connection():
    db_path = get_db_path()
    conn = sqlite3.connect(db_path, timeout=10.0)
    try:
        conn.execute("PRAGMA journal_mode=WAL;")
    except Exception:
        pass
    return conn

def init_db():
    conn = None
    try:
        conn = get_db_connection()
        c = conn.cursor()
        # Users table
        c.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                premium INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        try:
            c.execute('SELECT premium FROM users LIMIT 1')
        except sqlite3.OperationalError:
            try:
                c.execute('ALTER TABLE users ADD COLUMN premium INTEGER DEFAULT 0')
            except Exception:
                pass

        # Birth profile table
        c.execute('''
            CREATE TABLE IF NOT EXISTS profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                dob TEXT NOT NULL,
                tob TEXT NOT NULL,
                pob TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        # Chat history table
        c.execute('''
            CREATE TABLE IF NOT EXISTS chats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                role TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        # Wallet table
        c.execute('''
            CREATE TABLE IF NOT EXISTS user_wallet (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL UNIQUE,
                balance REAL DEFAULT 100.0,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        # Bookings table
        c.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                astrologer_name TEXT NOT NULL,
                date TEXT NOT NULL,
                time TEXT NOT NULL,
                mode TEXT NOT NULL,
                query TEXT NOT NULL,
                status TEXT DEFAULT 'Scheduled',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        # Contact messages table
        c.execute('''
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        # Transactions table
        c.execute('''
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                amount REAL NOT NULL,
                type TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')
        # Career applications table
        c.execute('''
            CREATE TABLE IF NOT EXISTS career_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                role TEXT NOT NULL,
                experience TEXT NOT NULL,
                bio TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
    except Exception as e:
        print(f"Database init warning: {e}")
    finally:
        if conn:
            try:
                conn.close()
            except Exception:
                pass

# Pre-initialize tables on module load
init_db()

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

# ----------------------------------------------------------------------
# 2. VERCEL SERVERLESS HANDLER CLASS
# ----------------------------------------------------------------------

class handler(BaseHTTPRequestHandler):
    """
    Vercel Serverless Function entry point.
    Handles all incoming HTTP requests under /api/*.
    """

    def _resolve_request(self):
        raw_path = self.path
        
        header_matched = self.headers.get('x-matched-path') or self.headers.get('x-forwarded-uri')
        if header_matched and header_matched.startswith('/api'):
            raw_path = header_matched

        parsed = urllib.parse.urlparse(raw_path)
        path = parsed.path.rstrip('/')
        query = parsed.query

        if path in ('/api/index.py', '/api'):
            qs = urllib.parse.parse_qs(query)
            if 'path' in qs:
                subpath = qs['path'][0].lstrip('/')
                path = f"/api/{subpath}".rstrip('/')

        return path, query

    def send_json_response(self, status, data):
        response_bytes = json.dumps(data).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(response_bytes)))
        self.send_header('Connection', 'close')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.end_headers()
        self.wfile.write(response_bytes)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.send_header('Connection', 'close')
        self.send_header('Content-Length', '0')
        self.end_headers()

    def serve_static_file(self, filename, content_type):
        candidates = [
            os.path.join(os.path.dirname(__file__), filename),
            os.path.join(os.path.dirname(__file__), '..', filename),
            os.path.abspath(filename),
            os.path.join(os.path.dirname(__file__), '..', 'development', 'vedasync', filename),
        ]
        for filepath in candidates:
            if os.path.exists(filepath) and os.path.isfile(filepath):
                try:
                    with open(filepath, 'rb') as f:
                        content = f.read()
                    self.send_response(200)
                    self.send_header('Content-Type', content_type)
                    self.send_header('Content-Length', str(len(content)))
                    self.send_header('Cache-Control', 'public, max-age=3600')
                    self.send_header('Connection', 'close')
                    self.end_headers()
                    self.wfile.write(content)
                    return
                except Exception as e:
                    self.send_json_response(500, {'error': f'Error reading {filename}: {str(e)}'})
                    return
        self.send_json_response(404, {'error': f'Static file {filename} not found'})

    # ---- GET REQUESTS ----

    def do_GET(self):
        path, query = self._resolve_request()

        # If root or static assets are routed through this serverless handler:
        if path in ('', '/', '/index.html'):
            self.serve_static_file('index.html', 'text/html; charset=utf-8')
            return
        elif path == '/style.css':
            self.serve_static_file('style.css', 'text/css; charset=utf-8')
            return
        elif path == '/app.js':
            self.serve_static_file('app.js', 'application/javascript; charset=utf-8')
            return
        elif path == '/astrology-engine.js':
            self.serve_static_file('astrology-engine.js', 'application/javascript; charset=utf-8')
            return
        elif path == '/gemini-api.js':
            self.serve_static_file('gemini-api.js', 'application/javascript; charset=utf-8')
            return
        elif path in ('/api', '/api/health'):
            self.send_json_response(200, {
                'status': 'ok',
                'app': 'Vedasync API',
                'version': '1.0.0',
                'platform': 'Vercel Serverless'
            })
        elif path == '/api/profile':
            self.handle_get_profile(query)
        elif path == '/api/chat':
            self.handle_get_chat(query)
        elif path == '/api/wallet':
            self.handle_get_wallet(query)
        elif path == '/api/bookings':
            self.handle_get_bookings(query)
        else:
            self.send_json_response(404, {'error': f'Route {path} not found'})

    # ---- POST REQUESTS ----

    def do_POST(self):
        path, _ = self._resolve_request()

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b''
        
        try:
            body = json.loads(post_data.decode('utf-8')) if post_data else {}
        except Exception:
            body = {}

        if path == '/api/auth/register':
            self.handle_register(body)
        elif path == '/api/auth/login':
            self.handle_login(body)
        elif path == '/api/profile':
            self.handle_save_profile(body)
        elif path == '/api/chat':
            self.handle_save_chat(body)
        elif path == '/api/wallet/recharge':
            self.handle_recharge_wallet(body)
        elif path == '/api/wallet/deduct':
            self.handle_deduct_wallet(body)
        elif path == '/api/bookings':
            self.handle_save_booking(body)
        elif path == '/api/contact':
            self.handle_save_contact(body)
        elif path == '/api/subscription/upgrade':
            self.handle_upgrade_subscription(body)
        elif path == '/api/careers/apply':
            self.handle_save_career_application(body)
        else:
            self.send_json_response(404, {'error': f'Route {path} not found'})

    # ---- DELETE REQUESTS ----

    def do_DELETE(self):
        path, query = self._resolve_request()

        if path == '/api/chat':
            self.handle_delete_chat(query)
        else:
            self.send_json_response(404, {'error': f'Route {path} not found'})

    # ------------------------------------------------------------------
    # 3. ROUTE HANDLERS
    # ------------------------------------------------------------------

    def handle_register(self, body):
        name = (body.get('name') or '').strip()
        email = (body.get('email') or '').strip().lower()
        password = body.get('password')

        if not name or not email or not password:
            self.send_json_response(400, {'error': 'Missing required fields (name, email, password)'})
            return

        hashed = hash_password(password)
        conn = None
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, hashed))
            user_id = c.lastrowid
            
            # Initial complimentary wallet balance: 100.0
            c.execute('INSERT INTO user_wallet (user_id, balance) VALUES (?, 100.0)', (user_id,))
            conn.commit()

            self.send_json_response(201, {
                'message': 'User registered successfully',
                'user': {'id': user_id, 'name': name, 'email': email, 'premium': 0}
            })
        except sqlite3.IntegrityError:
            self.send_json_response(400, {'error': 'Email already registered. Please sign in.'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_login(self, body):
        email = (body.get('email') or '').strip().lower()
        password = body.get('password')

        if not email or not password:
            self.send_json_response(400, {'error': 'Missing email or password'})
            return

        hashed = hash_password(password)
        conn = None
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('SELECT id, name, email, premium FROM users WHERE email = ? AND password = ?', (email, hashed))
            user = c.fetchone()

            if user:
                self.send_json_response(200, {
                    'message': 'Login successful',
                    'user': {'id': user[0], 'name': user[1], 'email': user[2], 'premium': user[3] or 0}
                })
            else:
                self.send_json_response(401, {'error': 'Invalid email or password'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_save_profile(self, body):
        user_id = body.get('user_id')
        name = body.get('name')
        dob = body.get('dob')
        tob = body.get('tob')
        pob = body.get('pob')

        if not user_id or not name or not dob or not tob or not pob:
            self.send_json_response(400, {'error': 'Missing profile fields'})
            return

        conn = None
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('SELECT id FROM profiles WHERE user_id = ?', (user_id,))
            exists = c.fetchone()

            if exists:
                c.execute('UPDATE profiles SET name = ?, dob = ?, tob = ?, pob = ? WHERE user_id = ?',
                          (name, dob, tob, pob, user_id))
            else:
                c.execute('INSERT INTO profiles (user_id, name, dob, tob, pob) VALUES (?, ?, ?, ?, ?)',
                          (user_id, name, dob, tob, pob))
            conn.commit()

            self.send_json_response(200, {'message': 'Profile saved successfully'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_get_profile(self, query):
        params = urllib.parse.parse_qs(query)
        user_ids = params.get('user_id')
        
        if not user_ids:
            self.send_json_response(400, {'error': 'Missing user_id parameter'})
            return
        
        conn = None
        try:
            user_id = int(user_ids[0])
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('SELECT name, dob, tob, pob FROM profiles WHERE user_id = ?', (user_id,))
            profile = c.fetchone()

            if profile:
                self.send_json_response(200, {
                    'profile': {'name': profile[0], 'dob': profile[1], 'tob': profile[2], 'pob': profile[3]}
                })
            else:
                self.send_json_response(404, {'error': 'Profile not found'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_save_chat(self, body):
        user_id = body.get('user_id')
        role = body.get('role')
        message = body.get('message')

        if not user_id or not role or not message:
            self.send_json_response(400, {'error': 'Missing chat fields (user_id, role, message)'})
            return

        conn = None
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('INSERT INTO chats (user_id, role, message) VALUES (?, ?, ?)', (user_id, role, message))
            conn.commit()

            self.send_json_response(201, {'message': 'Message saved successfully'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_get_chat(self, query):
        params = urllib.parse.parse_qs(query)
        user_ids = params.get('user_id')
        
        if not user_ids:
            self.send_json_response(400, {'error': 'Missing user_id parameter'})
            return
        
        conn = None
        try:
            user_id = int(user_ids[0])
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('SELECT role, message FROM chats WHERE user_id = ? ORDER BY created_at ASC', (user_id,))
            rows = c.fetchall()

            chat_history = [{'role': row[0], 'parts': [{'text': row[1]}]} for row in rows]
            self.send_json_response(200, {'history': chat_history})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_delete_chat(self, query):
        params = urllib.parse.parse_qs(query)
        user_ids = params.get('user_id')
        
        if not user_ids:
            self.send_json_response(400, {'error': 'Missing user_id parameter'})
            return
        
        conn = None
        try:
            user_id = int(user_ids[0])
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('DELETE FROM chats WHERE user_id = ?', (user_id,))
            conn.commit()

            self.send_json_response(200, {'message': 'Chat history deleted successfully'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_get_wallet(self, query):
        params = urllib.parse.parse_qs(query)
        user_ids = params.get('user_id')
        
        if not user_ids:
            self.send_json_response(400, {'error': 'Missing user_id parameter'})
            return
        
        conn = None
        try:
            user_id = int(user_ids[0])
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('SELECT balance FROM user_wallet WHERE user_id = ?', (user_id,))
            row = c.fetchone()
            
            if not row:
                c.execute('INSERT INTO user_wallet (user_id, balance) VALUES (?, 100.0)', (user_id,))
                conn.commit()
                balance = 100.0
            else:
                balance = row[0]
                
            self.send_json_response(200, {'balance': balance})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_recharge_wallet(self, body):
        user_id = body.get('user_id')
        amount = body.get('amount')

        if not user_id or amount is None:
            self.send_json_response(400, {'error': 'Missing user_id or amount'})
            return

        conn = None
        try:
            amount = float(amount)
            conn = get_db_connection()
            c = conn.cursor()
            
            c.execute('SELECT balance FROM user_wallet WHERE user_id = ?', (user_id,))
            row = c.fetchone()
            
            if not row:
                new_balance = 100.0 + amount
                c.execute('INSERT INTO user_wallet (user_id, balance) VALUES (?, ?)', (user_id, new_balance))
            else:
                new_balance = row[0] + amount
                c.execute('UPDATE user_wallet SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
                          (new_balance, user_id))
                
            c.execute('INSERT INTO transactions (user_id, amount, type) VALUES (?, ?, ?)',
                      (user_id, amount, 'Recharge'))
            conn.commit()

            self.send_json_response(200, {'message': 'Recharge successful', 'balance': new_balance})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_deduct_wallet(self, body):
        user_id = body.get('user_id')
        amount = body.get('amount')

        if not user_id or amount is None:
            self.send_json_response(400, {'error': 'Missing user_id or amount'})
            return

        conn = None
        try:
            amount = float(amount)
            conn = get_db_connection()
            c = conn.cursor()
            
            c.execute('SELECT balance FROM user_wallet WHERE user_id = ?', (user_id,))
            row = c.fetchone()
            
            if not row:
                new_balance = max(0.0, 100.0 - amount)
                c.execute('INSERT INTO user_wallet (user_id, balance) VALUES (?, ?)', (user_id, new_balance))
            else:
                new_balance = max(0.0, row[0] - amount)
                c.execute('UPDATE user_wallet SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
                          (new_balance, user_id))
                
            c.execute('INSERT INTO transactions (user_id, amount, type) VALUES (?, ?, ?)',
                      (user_id, -amount, 'Consultation'))
            conn.commit()

            self.send_json_response(200, {'message': 'Deduction successful', 'balance': new_balance})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_get_bookings(self, query):
        params = urllib.parse.parse_qs(query)
        user_ids = params.get('user_id')
        
        if not user_ids:
            self.send_json_response(400, {'error': 'Missing user_id parameter'})
            return
        
        conn = None
        try:
            user_id = int(user_ids[0])
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('''
                SELECT astrologer_name, date, time, mode, query, status, created_at 
                FROM bookings WHERE user_id = ? ORDER BY date DESC, time DESC
            ''', (user_id,))
            rows = c.fetchall()

            bookings = [{
                'astrologer_name': row[0],
                'date': row[1],
                'time': row[2],
                'mode': row[3],
                'query': row[4],
                'status': row[5],
                'created_at': row[6]
            } for row in rows]
            
            self.send_json_response(200, {'bookings': bookings})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_save_booking(self, body):
        user_id = body.get('user_id')
        astrologer_name = body.get('astrologer_name')
        date = body.get('date')
        time = body.get('time')
        mode = body.get('mode')
        query = body.get('query')

        if not user_id or not astrologer_name or not date or not time or not mode or not query:
            self.send_json_response(400, {'error': 'Missing required booking parameters'})
            return

        conn = None
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('''
                INSERT INTO bookings (user_id, astrologer_name, date, time, mode, query)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (user_id, astrologer_name, date, time, mode, query))
            conn.commit()

            self.send_json_response(201, {'message': 'Booking registered successfully'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_save_contact(self, body):
        name = (body.get('name') or '').strip()
        email = (body.get('email') or '').strip()
        subject = (body.get('subject') or '').strip()
        message = (body.get('message') or '').strip()

        if not name or not email or not subject or not message:
            self.send_json_response(400, {'error': 'Missing contact fields'})
            return

        conn = None
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('''
                INSERT INTO contact_messages (name, email, subject, message)
                VALUES (?, ?, ?, ?)
            ''', (name, email, subject, message))
            conn.commit()

            self.send_json_response(201, {'message': 'Message sent successfully'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_upgrade_subscription(self, body):
        user_id = body.get('user_id')
        plan_name = body.get('plan_name', 'Premium')

        if not user_id:
            self.send_json_response(400, {'error': 'Missing user_id'})
            return

        conn = None
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('UPDATE users SET premium = 1 WHERE id = ?', (user_id,))
            c.execute('INSERT INTO transactions (user_id, amount, type) VALUES (?, ?, ?)',
                      (user_id, 149.0, 'Subscription: ' + plan_name))
            conn.commit()

            self.send_json_response(200, {'message': 'Subscription upgraded successfully', 'premium': 1})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

    def handle_save_career_application(self, body):
        name = (body.get('name') or '').strip()
        email = (body.get('email') or '').strip()
        role = (body.get('role') or '').strip()
        experience = (body.get('experience') or '').strip()
        bio = (body.get('bio') or '').strip()

        if not name or not email or not role or not experience or not bio:
            self.send_json_response(400, {'error': 'Missing required career application fields'})
            return

        conn = None
        try:
            conn = get_db_connection()
            c = conn.cursor()
            c.execute('''
                INSERT INTO career_applications (name, email, role, experience, bio)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, role, experience, bio))
            conn.commit()

            self.send_json_response(201, {'message': 'Application submitted successfully'})
        except Exception as e:
            self.send_json_response(500, {'error': str(e)})
        finally:
            if conn:
                try:
                    conn.close()
                except Exception:
                    pass

# Support running directly via python
if __name__ == '__main__':
    from http.server import ThreadingHTTPServer
    PORT = int(os.environ.get('PORT', 3000))
    ThreadingHTTPServer.allow_reuse_address = True
    print(f"Starting Vedasync Serverless API locally on port {PORT}...")
    server = ThreadingHTTPServer(("", PORT), handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server.")
