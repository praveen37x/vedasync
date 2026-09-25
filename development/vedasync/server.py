"""
Vedasync Local Development Server
Serves static frontend assets (HTML, CSS, JS) and routes /api/* to the serverless handler
"""

import http.server
import socketserver
import os
import sys
import urllib.parse

# Set working directory to server location
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT_DIR)
sys.path.insert(0, ROOT_DIR)

from api.index import handler as ApiHandler, init_db

PORT = int(os.environ.get('PORT', 3000))

class VedasyncServer(http.server.SimpleHTTPRequestHandler):
    """
    Serves static files for frontend routes and delegates /api/*
    to the Vercel-compatible ApiHandler.
    """

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith('/api') or parsed.path in ('/api', '/api/health'):
            ApiHandler.do_GET(self)
        else:
            # Serve static files (index.html, style.css, app.js, etc.)
            super().do_GET()

    def do_POST(self):
        ApiHandler.do_POST(self)

    def do_DELETE(self):
        ApiHandler.do_DELETE(self)

    # Delegate helper methods to ApiHandler
    def _resolve_request(self):
        return ApiHandler._resolve_request(self)

    def send_json_response(self, status, data):
        return ApiHandler.send_json_response(self, status, data)

if __name__ == '__main__':
    init_db()
    print(f"==================================================")
    print(f"  Vedasync Local Server running on http://localhost:{PORT}")
    print(f"  - Static Assets: Serving from {ROOT_DIR}")
    print(f"  - API Endpoints: Routed to api.index (Vercel Engine)")
    print(f"==================================================")
    
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("", PORT), VedasyncServer) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down Vedasync server.")
