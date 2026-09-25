# 🚀 Vedasync Vercel Deployment & Hosting Guide

Vedasync is fully configured for deployment on **Vercel** with global Edge CDN asset serving and Python Serverless Functions.

---

## ⚡ Option 1: Deploy via GitHub (Recommended - 2 Minutes)

### Step 1: Push your code to GitHub
If you haven't already, push this project folder to a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit: Vedasync Vercel ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vedasync.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **"Add New..."** > **"Project"**.
3. Select your `vedasync` repository and click **Import**.
4. Leave **Framework Preset** as **Other**.
5. Leave **Root Directory** as `./` (default).
6. *(Optional)* Under **Environment Variables**, add:
   * `GEMINI_API_KEY`: *(Your Google Gemini API Key if you want automatic AI responses)*
7. Click **Deploy**.

🎉 **Done!** Vercel will deploy your project in under 30 seconds and provide a live production URL (e.g., `https://vedasync.vercel.app`).

---

## 💻 Option 2: Deploy via Vercel CLI

If you prefer using the terminal:

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Deploy
Navigate to the project root directory and run:
```bash
vercel
```
* Follow the interactive prompts (press Enter to accept defaults).
* For production deployment:
```bash
vercel --prod
```

---

## 🛠️ Architecture & Features on Vercel

| Component | How It Works on Vercel |
| :--- | :--- |
| **Frontend** | Static HTML5, CSS3, JavaScript served via **Vercel Edge Network CDN** with instant global caching. |
| **Backend API** | Serverless function in `api/index.py` executes on-demand using Vercel's Python runtime. |
| **Database** | Ephemeral serverless SQLite initialized in `/tmp/vedasync_active.db`, auto-seeded from starter database. |
| **Offline Fallback** | Client-side `localStorage` caching ensures uninterrupted experience during cold starts. |
| **Routing** | `vercel.json` rewrites all `/api/*` calls directly to `api/index.py` with clean URL handling. |

---

## 🔑 Environment Variables (Optional)

Configure these in **Vercel Project Settings > Environment Variables**:

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | *(Optional)* Google Gemini API key for live AI astrologer chats. If not set, users can enter their key directly in the web UI Settings modal, or use the built-in simulated readings. |

---

## 🧪 Local Testing

You can still run Vedasync locally at any time:

```bash
# Option A: Standard Server
python server.py

# Option B: Serverless API Simulation
python api/index.py
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
