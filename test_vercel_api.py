"""
Automated Verification Script for Vedasync Vercel API
Tests all endpoints using the serverless handler
"""

import os
import sys
import json
import urllib.request
import urllib.error
import threading
import time
from http.server import ThreadingHTTPServer

# Set VERCEL environment variable to test serverless /tmp database logic
os.environ['VERCEL'] = '1'

# Import handler
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from api.index import handler, init_db

TEST_PORT = 3456
BASE_URL = f"http://127.0.0.1:{TEST_PORT}"

def run_server():
    ThreadingHTTPServer.allow_reuse_address = True
    server = ThreadingHTTPServer(("127.0.0.1", TEST_PORT), handler)
    server.serve_forever()

def post(endpoint, data):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Connection': 'close'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def get(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, headers={'Connection': 'close'})
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def delete(endpoint):
    url = f"{BASE_URL}{endpoint}"
    req = urllib.request.Request(url, method='DELETE', headers={'Connection': 'close'})
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))

def main():
    print("Starting test server in Vercel simulation mode...")
    init_db()
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    time.sleep(0.5)

    print("Running verification tests...")
    test_user_email = f"test_{int(time.time())}@vedasync.com"
    user_id = None

    # 1. Health check
    status, res = get('/api/health')
    assert status == 200 and res.get('status') == 'ok', f"Health check failed: {res}"
    print("  [PASS] 1. Health Check (/api/health)")

    # 2. Registration
    status, res = post('/api/auth/register', {
        'name': 'Aarav Sharma',
        'email': test_user_email,
        'password': 'SecretPassword123'
    })
    assert status == 201, f"Registration failed ({status}): {res}"
    user_id = res['user']['id']
    print(f"  [PASS] 2. User Registration (user_id: {user_id})")

    # 3. Duplicate registration check
    status, res = post('/api/auth/register', {
        'name': 'Aarav Sharma',
        'email': test_user_email,
        'password': 'SecretPassword123'
    })
    assert status == 400, f"Duplicate check failed ({status}): {res}"
    print("  [PASS] 3. Duplicate Email Protection")

    # 4. Login
    status, res = post('/api/auth/login', {
        'email': test_user_email,
        'password': 'SecretPassword123'
    })
    assert status == 200 and res['user']['email'] == test_user_email, f"Login failed: {res}"
    print("  [PASS] 4. User Login")

    # 5. Profile Save & Get
    status, res = post('/api/profile', {
        'user_id': user_id,
        'name': 'Aarav Sharma',
        'dob': '1995-04-12',
        'tob': '14:30',
        'pob': 'Varanasi, India'
    })
    assert status == 200, f"Save profile failed: {res}"

    status, res = get(f'/api/profile?user_id={user_id}')
    assert status == 200 and res['profile']['pob'] == 'Varanasi, India', f"Get profile failed: {res}"
    print("  [PASS] 5. Birth Profile Upsert and Retrieval")

    # 6. Wallet: Balance, Recharge, Deduct
    status, res = get(f'/api/wallet?user_id={user_id}')
    assert status == 200 and res['balance'] >= 100.0, f"Wallet balance failed: {res}"
    initial_bal = res['balance']

    status, res = post('/api/wallet/recharge', {'user_id': user_id, 'amount': 250.0})
    assert status == 200 and res['balance'] == initial_bal + 250.0, f"Wallet recharge failed: {res}"

    status, res = post('/api/wallet/deduct', {'user_id': user_id, 'amount': 50.0})
    assert status == 200 and res['balance'] == initial_bal + 200.0, f"Wallet deduct failed: {res}"
    print("  [PASS] 6. Wallet Management (Balance, Recharge, Deduct)")

    # 7. Chat: Save, Get, Delete
    status, res = post('/api/chat', {
        'user_id': user_id,
        'role': 'user',
        'message': 'What does my Saturn placement indicate?'
    })
    assert status == 201, f"Save chat failed: {res}"

    status, res = get(f'/api/chat?user_id={user_id}')
    assert status == 200 and len(res['history']) >= 1, f"Get chat failed: {res}"

    status, res = delete(f'/api/chat?user_id={user_id}')
    assert status == 200, f"Delete chat failed: {res}"
    print("  [PASS] 7. Astrologer Chat History (Save, Get, Clear)")

    # 8. Bookings: Save & Get
    status, res = post('/api/bookings', {
        'user_id': user_id,
        'astrologer_name': 'Acharya Vashishta',
        'date': '2026-10-01',
        'time': '11:00',
        'mode': 'Video Call',
        'query': 'Career transition analysis'
    })
    assert status == 201, f"Save booking failed: {res}"

    status, res = get(f'/api/bookings?user_id={user_id}')
    assert status == 200 and len(res['bookings']) >= 1, f"Get bookings failed: {res}"
    print("  [PASS] 8. Consultation Bookings")

    # 9. Contact Message
    status, res = post('/api/contact', {
        'name': 'Aarav Sharma',
        'email': test_user_email,
        'subject': 'Inquiry about Gemstone Consultation',
        'message': 'Hello, I would like to inquire about Yellow Sapphire suitability.'
    })
    assert status == 201, f"Save contact failed: {res}"
    print("  [PASS] 9. Contact Message Submission")

    # 10. Subscription Upgrade
    status, res = post('/api/subscription/upgrade', {
        'user_id': user_id,
        'plan_name': 'Jyotish Pro Plus'
    })
    assert status == 200 and res['premium'] == 1, f"Upgrade failed: {res}"
    print("  [PASS] 10. Subscription Upgrade")

    # 11. Career Application
    status, res = post('/api/careers/apply', {
        'name': 'Aarav Sharma',
        'email': test_user_email,
        'role': 'Vedic Astrologer (Jyotishi)',
        'experience': '7 years',
        'bio': 'Experienced in Parashari Jyotish and Lal Kitab remedies.'
    })
    assert status == 201, f"Career application failed: {res}"
    print("  [PASS] 11. Career Application Submission")

    # 12. Test path rewrite parsing (?path=...)
    status, res = get(f'/api/index.py?path=wallet&user_id={user_id}')
    assert status == 200, f"Rewrite query path failed: {res}"
    print("  [PASS] 12. Vercel Rewrite URL Parsing (?path=...)")

    print("\n==============================================")
    print(" ALL 12 VERIFICATION TESTS PASSED SUCCESSFULLY! ")
    print("==============================================")

if __name__ == '__main__':
    main()
