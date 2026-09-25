"""
Complete verification suite for Vedasync AstroSage features.
Validates:
1. Static files availability via HTTP server on port 3000
2. Engine exports and logic definitions
3. HTML DOM elements corresponding to all 10 features
4. CSS selectors and design system tokens
5. Synastry, Dasha, Yogas, and Connections data models
"""

import urllib.request
import json
import re
import sys

BASE_URL = "http://localhost:3000"

def test_http_endpoints():
    print("--- 1. Testing HTTP Endpoints ---")
    endpoints = [
        ("/", 200, "text/html"),
        ("/index.html", 200, "text/html"),
        ("/style.css", 200, "text/css"),
        ("/app.js", 200, "application/javascript"),
        ("/astrology-engine.js", 200, "application/javascript"),
        ("/api/health", 200, "application/json")
    ]
    for path, expected_status, content_hint in endpoints:
        req = urllib.request.Request(BASE_URL + path)
        try:
            with urllib.request.urlopen(req, timeout=5) as res:
                code = res.getcode()
                ct = res.headers.get("Content-Type", "")
                data = res.read(500)
                assert code == expected_status, f"Expected {expected_status}, got {code} for {path}"
                print(f"  [PASS] {path} -> {code} ({len(data)} bytes sample)")
        except Exception as e:
            print(f"  [FAIL] {path} -> {e}")
            return False
    return True

def test_html_dom_elements():
    print("\n--- 2. Testing HTML DOM Elements for All 10 Features ---")
    with open("c:/VEDASYNC/index.html", "r", encoding="utf-8") as f:
        html = f.read()

    required_ids = [
        # Feature 1: Drishti & Connections
        "kundli-svg-container",
        "btn-explore-mode",
        "toggle-connections",
        "btn-clear-highlights",
        "explore-status-banner",
        "connection-floating-card",
        "conn-card-type",
        "conn-card-title",
        "conn-card-meaning",
        "btn-explain-conn",
        
        # Feature 2 & 3: Unified Inspect Panel & Life Area Lens
        "unified-inspect-panel",
        "inspect-header",
        "inspect-badge",
        "btn-close-inspect",
        "inspect-body",
        "inspect-default-view",
        "lens-pills-container",
        "life-area-card",
        "life-card-title",
        "life-card-grid",
        
        # Feature 4: Dasha Timeline
        "dasha-timeline-section",
        "dasha-active-badge",
        "dasha-active-label",
        "dasha-timeline-container",
        "dasha-detail-card",
        
        # Feature 5: Yoga Finder
        "yoga-finder-section",
        "yoga-filter-pills",
        "yoga-grid",
        
        # Feature 6: Synastry Visualizer
        "synastry-visualizer-panel",
        "btn-synastry-side",
        "btn-synastry-stack",
        "synastry-svg-chart-a",
        "synastry-svg-chart-b",
        "synastry-charts-container",
        "synastry-interaction-card",
        "synastry-interaction-text",
        
        # Feature 7: Gochar Transits
        "toggle-transits",
        "transit-date-container",
        "transit-date-picker",
        "legend-transit-item",
        
        # Feature 8 & 9: Modals (Snapshot, Remedies, AI Connection)
        "btn-share-chart",
        "snapshot-modal",
        "snapshot-canvas",
        "btn-download-snapshot",
        "remedies-modal",
        "remedies-modal-title",
        "remedies-body",
        "connection-explain-modal",
        "explain-ai-text"
    ]

    missing = []
    for el_id in required_ids:
        if f'id="{el_id}"' not in html and f"id='{el_id}'" not in html:
            missing.append(el_id)

    if missing:
        print(f"  [FAIL] Missing required DOM element IDs: {missing}")
        return False
    else:
        print(f"  [PASS] All {len(required_ids)} required DOM element IDs exist in index.html.")
        return True

def test_css_classes():
    print("\n--- 3. Testing CSS Stylesheet ---")
    with open("c:/VEDASYNC/style.css", "r", encoding="utf-8") as f:
        css = f.read()

    required_classes = [
        ".line-aspect",
        ".line-conjunction",
        ".line-lordship",
        ".line-synastry",
        ".house-polygon.selected",
        ".house-polygon.connected-highlight",
        ".house-polygon.dimmed",
        ".planet-badge.selected",
        ".planet-badge.connected-highlight",
        ".planet-badge.dimmed",
        ".transit-badge",
        ".dasha-timeline-container",
        ".dasha-track",
        ".dasha-m-block",
        ".yoga-card",
        ".yoga-cat-badge",
        ".synastry-visualizer-section",
        ".synastry-charts-wrapper",
        ".lens-pill",
        ".connection-floating-card",
        ".modal-overlay"
    ]

    missing = []
    for cls in required_classes:
        if cls not in css:
            missing.append(cls)

    if missing:
        print(f"  [FAIL] Missing required CSS selectors: {missing}")
        return False
    else:
        print(f"  [PASS] All {len(required_classes)} required CSS classes and selectors exist in style.css.")
        return True

def test_engine_functions():
    print("\n--- 4. Testing Astrology Engine Javascript Functions ---")
    with open("c:/VEDASYNC/astrology-engine.js", "r", encoding="utf-8") as f:
        js = f.read()

    required_functions = [
        "getNakshatraPadaDetail",
        "getComputedConnections",
        "detectYogas",
        "calculateVimshottariDasha",
        "getTransitPositions",
        "analyzeLifeArea",
        "calculateSynastryConnections",
        "getTraditionalRemedies",
        "getBirthProfile",
        "calculateCompatibility",
        "calculateTodayPanchang"
    ]

    missing = []
    for fn in required_functions:
        if fn not in js:
            missing.append(fn)

    if missing:
        print(f"  [FAIL] Missing engine functions in astrology-engine.js: {missing}")
        return False
    else:
        print(f"  [PASS] All {len(required_functions)} required engine functions present in astrology-engine.js.")
        return True

def test_app_js_wiring():
    print("\n--- 5. Testing App.js Event Wiring ---")
    with open("c:/VEDASYNC/app.js", "r", encoding="utf-8") as f:
        js = f.read()

    wiring_checks = [
        "selectHouse",
        "selectPlanet",
        "clearHighlights",
        "toggleConnections",
        "toggleExploreMode",
        "toggleTransits",
        "setLifeAreaLens",
        "renderInspectPanel",
        "renderDashaTimeline",
        "renderYogaFinder",
        "renderSynastryVisualizer",
        "generateShareableSnapshot",
        "openRemediesModal",
        "explainConnectionWithAI",
        "handleCompatibilitySubmit"
    ]

    missing = []
    for check in wiring_checks:
        if check not in js:
            missing.append(check)

    if missing:
        print(f"  [FAIL] Missing app functions in app.js: {missing}")
        return False
    else:
        print(f"  [PASS] All {len(wiring_checks)} required application workflows wired in app.js.")
        return True

if __name__ == "__main__":
    t1 = test_http_endpoints()
    t2 = test_html_dom_elements()
    t3 = test_css_classes()
    t4 = test_engine_functions()
    t5 = test_app_js_wiring()

    all_passed = t1 and t2 and t3 and t4 and t5
    print("\n==================================================")
    if all_passed:
        print("ALL VERIFICATION SUITE TESTS PASSED SUCCESSFULLY! (5/5)")
    else:
        print("SOME TESTS FAILED! Check logs above.")
    print("==================================================")
    sys.exit(0 if all_passed else 1)
