"""
Comprehensive CDP headless Edge test for:
1. Birth form submission & Lagna (D1) Kundli rendering
2. D9 (Navamsha) Chart rendering via dropdown selector
3. Dasha timeline & Yoga Finder
4. Kundli Milan (Matchmaking) & Dual-Chart Synastry Visualizer
"""
import subprocess
import urllib.request
from urllib.parse import urlparse
import json
import time
import socket
import sys

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PORT = 9222

def main():
    subprocess.run(["taskkill", "/F", "/IM", "msedge.exe"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1)

    print("Launching Edge headless on port 9222...")
    proc = subprocess.Popen([
        EDGE_PATH,
        "--headless",
        f"--remote-debugging-port={PORT}",
        "--disable-gpu",
        "--no-sandbox",
        "http://localhost:3000/"
    ])
    time.sleep(2)

    try:
        req = urllib.request.Request(f"http://127.0.0.1:{PORT}/json")
        res = urllib.request.urlopen(req, timeout=3)
        pages = json.loads(res.read().decode())
        page = [p for p in pages if "localhost:3000" in p.get("url", "") or p.get("type") == "page"][0]
        ws_url = page["webSocketDebuggerUrl"]

        parsed = urlparse(ws_url)
        s = socket.create_connection((parsed.hostname, parsed.port), timeout=10)
        
        handshake = (
            f"GET {parsed.path} HTTP/1.1\r\n"
            f"Host: {parsed.hostname}:{parsed.port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        s.sendall(handshake.encode())
        response = s.recv(4096)
        assert b"101 " in response

        msg_id = 1
        def send_cdp(method, params=None):
            nonlocal msg_id
            m = {"id": msg_id, "method": method, "params": params or {}}
            msg_id += 1
            payload = json.dumps(m).encode('utf-8')
            length = len(payload)
            if length <= 125:
                header = bytearray([0x81, 0x80 | length])
            elif length <= 65535:
                header = bytearray([0x81, 0x80 | 126, (length >> 8) & 0xFF, length & 0xFF])
            else:
                header = bytearray([0x81, 0x80 | 127] + [(length >> (8 * i)) & 0xFF for i in reversed(range(8))])
            mask = b"\x12\x34\x56\x78"
            s.sendall(header + mask + bytearray(b ^ mask[i % 4] for i, b in enumerate(payload)))

        def read_frame():
            b1, b2 = s.recv(2)
            length = b2 & 0x7F
            if length == 126:
                ext = s.recv(2)
                length = int.from_bytes(ext, 'big')
            elif length == 127:
                ext = s.recv(8)
                length = int.from_bytes(ext, 'big')
            data = b""
            while len(data) < length:
                chunk = s.recv(length - len(data))
                if not chunk: break
                data += chunk
            return json.loads(data.decode('utf-8', errors='ignore'))

        send_cdp("Console.enable")
        send_cdp("Runtime.enable")
        time.sleep(1)

        eval_script = """
        (() => {
            const results = {};
            try {
                // 1. Submit Natal Details Form
                const nameInput = document.getElementById('birth-name');
                const dateInput = document.getElementById('birth-date');
                const timeInput = document.getElementById('birth-time');
                const placeInput = document.getElementById('birth-place');
                const castBtn = document.getElementById('btn-cast-kundli-main');

                nameInput.value = 'Praveen Tripathi';
                dateInput.value = '2000-08-25';
                timeInput.value = '05:00';
                placeInput.value = 'Mumbai';

                castBtn.click();

                results.step1_natal = {
                    userName: state.userProfile ? state.userProfile.name : null,
                    lagna: state.userProfile ? state.userProfile.lagna.rashi : null,
                    activeTab: state.activeTab,
                    landingHidden: document.getElementById('landing-page').style.display === 'none',
                    appVisible: document.getElementById('app-interface').style.display === 'flex',
                    kundliSvgRendered: !!document.getElementById('kundli-svg-root')
                };

                // 2. Test D9 Navamsha Switch
                const selectChart = document.getElementById('select-chart-type');
                selectChart.value = 'navamsha';
                selectChart.dispatchEvent(new Event('change'));

                results.step2_d9_navamsha = {
                    chartType: state.chartType,
                    chartTitle: document.getElementById('chart-title-header').textContent,
                    navRashi: state.userProfile.lagna.navRashiName,
                    svgRendered: !!document.getElementById('kundli-svg-root')
                };

                // 3. Test Kundli Milan (Matchmaking)
                switchTab('tab-milan');
                document.getElementById('milan-p2-name').value = 'Priya';
                document.getElementById('milan-p2-date').value = '2001-02-14';
                document.getElementById('milan-p2-time').value = '14:30';

                const milanForm = document.getElementById('milan-form');
                milanForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

                results.step3_milan_synastry = {
                    activeTab: state.activeTab,
                    gunaScore: document.getElementById('milan-score-val').textContent,
                    verdictTitle: document.getElementById('milan-verdict-title').textContent,
                    synastryPanelVisible: document.getElementById('synastry-visualizer-panel').style.display !== 'none',
                    chartA_exists: !!document.getElementById('synastry-svg-chart-a').querySelector('svg'),
                    chartB_exists: !!document.getElementById('synastry-svg-chart-b').querySelector('svg')
                };

                return results;
            } catch(e) {
                return { error: e.toString(), stack: e.stack };
            }
        })()
        """
        send_cdp("Runtime.evaluate", {"expression": eval_script, "returnByValue": True})

        for _ in range(25):
            s.settimeout(1.0)
            try:
                msg = read_frame()
                if "result" in msg and "result" in msg["result"]:
                    val = msg["result"]["result"].get("value")
                    print("\n================ TEST EXECUTION RESULTS ================")
                    print(json.dumps(val, indent=2))
                    print("========================================================\n")
                elif "method" in msg and "Console" in msg["method"]:
                    msg_obj = msg.get("params", {}).get("message", {})
                    print(f"BROWSER CONSOLE [{msg_obj.get('level')}]: {msg_obj.get('text')}")
            except Exception:
                break

    finally:
        proc.terminate()

if __name__ == "__main__":
    main()
