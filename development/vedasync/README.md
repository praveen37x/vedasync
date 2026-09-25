# 🌌 Vedasync — AI-Powered Vedic Astrology & AstroSage-Grade Kundli Platform

[![Vedic Astrology](https://img.shields.io/badge/Vedic-Parashari%20Astrology-amber)](https://github.com/praveen37x/vedasync)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue)](https://www.python.org/)
[![Vercel Serverless](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com)

Vedasync is a modern, full-featured Vedic astrology application that brings ancient astronomical wisdom into a sleek celestial UI. Engineered with authentic Parashari mathematical calculations, dynamic SVG Kundli visualizations, multi-layered planetary relationship graphing, Vimshottari Dasha chronology, automated Yoga detection, and dual-chart synastry matching.

---

## ✨ Key Features

### 1. 🪐 Drishti & Connections Layer
- **Interactive North Indian Kundli:** Exact mathematical centroid coordinates for Kendra diamonds and Trikona triangles.
- **Dynamic Entity Highlighting:** Select any planet or house to trigger a radiant white glow (`#FFFFFF`), illuminating direct connections while dimming unrelated elements.
- **Animated SVG Quadratic Bézier Connectors:**
  - `Line-Aspect` (Dashed indigo) — Graha Drishti (full Parashari aspects: Mars 4/7/8, Jupiter 5/7/9, Saturn 3/7/10, standard 7th).
  - `Line-Conjunction` (Solid amber) — Planetary conjunctions sharing the same Bhavam.
  - `Line-Lordship` (Dotted purple) — Connection between house lords and their active placement.
- **Floating Connection Intelligence Card:** Hover or click any connector line to inspect relationship metadata, source/destination houses, and classical Vedic interpretations.
- **Explore Connections Mode:** One-click global relationship mapping across all active houses.

### 2. 🔍 Unified Cosmic Inspect Panel
- Dual-mode inspector (`house` and `planet`).
- **House Inspections:** Sign, Sanskrit Bhavam significance, Lord, Lord Placement, Occupants, Aspecting Grahas, associated Yogas, and Connected House Chain (`H# → Lord → Placement`).
- **Planet Inspections:** Sanskrit Dignity (Uchcha / Exalted, Moolatrikona, Swakshetra, Mitra, Sama, Shatru, Neecha / Debilitated), degree precision, 108-pada Nakshatra drill-down, Navamsha sign, Purushartha (Dharma, Artha, Kama, Moksha), Ruling Deity, Akshara syllable, Karmic themes, and authentic traditional remedies.

### 3. ⏳ 120-Year Vimshottari Dasha Timeline
- Complete astronomical Vimshottari tree (Mahadasha → Antardasha → Pratyantardasha) calculated from natal Moon longitude and Nakshatra lord.
- Horizontal snap-scrolling chronology with real-time active period marker (`pulse-indicator`).
- Period detail card with house lordship and chart-highlighting integration.

### 4. ⚡ Authentic Vedic Yoga Finder
- Automatic detection engine scanning genuine chart data:
  - **Pancha Mahapurusha Yogas:** Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter), Malavya (Venus), Shasha (Saturn).
  - **Raj Yogas:** Kendra-Trikona Lord alignments, Dharma-Karmadhipati Yoga.
  - **Dhana Yogas:** Wealth alignments across 1st, 2nd, 5th, 9th, and 11th lords.
  - **Vipreet Raj Yogas:** Harsha (6th in 6th/8th/12th), Sarala (8th in 6th/8th/12th), Vimala (12th in 6th/8th/12th).
  - **Special Auspicious Yogas:** Gajakesari (Jupiter-Moon Kendra), Budhaditya (Sun-Mercury), Neecha Bhanga Raj Yoga, Chandra-Mangala, Amala, and Saraswati Yogas.
- Instant chart linking: clicking any yoga card highlights the exact participating planets and houses on the Kundli.

### 5. ❤️ Kundli Milan & Dual-Chart Synastry Visualizer
- **36-Guna Ashtakoota Analysis:** Complete scoring breakdown across Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot, and Nadi with detailed astrological commentary.
- **Dual-Chart Synastry Visualizer:** Side-by-side or stacked dual North Indian charts for Partner A and Partner B with inter-chart harmonic connector lines.

### 6. 🌌 Gochar (Transit) Overlay & Sade Sati Monitor
- Real-time planetary Gochar overlay with cyan `T-` badges positioned directly inside natal houses.
- Live transit calculation from both Lagna and Janma Rashi (Moon).
- Custom transit date picker to model past or future celestial transits.
- Automatic Sade Sati phase detection (Rising, Peak, Setting).

### 7. 🔮 Life Area Lens
- Multi-pill focus lens for Career, Marriage, Finance, Health, Education, Spirituality, and Property.
- Highlights relevant Bhavas and Karakas on the Kundli while displaying a thematic summary card.

### 8. 📸 Shareable Snapshot & Traditional Remedies
- Single-click HTML5 Canvas generator rendering high-resolution AstroSage-style Kundli cards for PNG download and instant clipboard sharing.
- Traditional cultural remedies panel offering planetary gemstones, Sanskrit mantras, presiding deities, and charity recommendations.

---

## 🛠️ Architecture & Tech Stack

```
vedasync/
├── index.html                # Responsive celestial UI shell & SVG layout
├── style.css                 # Vanilla CSS design system, glassmorphism & animations
├── app.js                    # Application coordinator, SVG graph rendering & UI state
├── astrology-engine.js       # Authentic Vedic astronomical calculation engine
├── gemini-api.js             # AI Astrologer consultation coordinator
├── server.py                 # Local development server with Vercel API routing
├── api/
│   ├── index.py              # Serverless API handler (SQLite, Auth, Sessions)
│   └── index.html            # Static bundle fallback
├── development/vedasync/     # Development mirror workspace
└── test_complete_suite.py    # Automated verification test suite
```

- **Frontend:** Pure Vanilla HTML5, CSS3, and JavaScript (Zero external dependencies).
- **Backend:** Python 3.12 (HTTP Server + SQLite3 + Vercel Serverless Function).
- **Rendering:** SVG vector graphics with responsive quadratic Bézier connector geometry.

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+ installed
- Git installed

### Local Run
1. Clone the repository:
   ```bash
   git clone git@github.com:praveen37x/vedasync.git
   cd vedasync
   ```

2. Start the local server:
   ```bash
   python server.py
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Running Tests
To run the automated verification suite validating all 10 feature modules, DOM structures, and HTTP routes:
```bash
python test_complete_suite.py
```

---

## ☁️ Deployment (Vercel)

This project is pre-configured for zero-config deployment on **Vercel**:
```bash
vercel deploy --prod
```
The included `vercel.json` and `api/index.py` handle serverless routing and writable `/tmp` SQLite session storage automatically.

---

## 📜 Cultural & Ethical Notice
Astrological insights and remedies provided by Vedasync are rooted in classical Vedic heritage and intended for self-reflection and educational appreciation. They are non-prescriptive and should not replace professional medical, financial, or legal counsel.

---

## 📄 License
Released under the [MIT License](LICENSE).
