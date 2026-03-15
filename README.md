<div align="center">

# 🥩 Personal Protein Tracker

**A frictionless, mobile-first web app for tracking daily protein intake via Natural Language.**

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/Groq-f3f4f6?style=for-the-badge&logo=openai&logoColor=f55036)](https://groq.com/)

</div>

---

## 💡 The Core Problem

When you start going to the gym, the biggest problem isn’t workouts—it’s consistently hitting your protein intake. Traditional calorie trackers (like MyFitnessPal) are great, but the friction of searching databases, selecting specific portions, and navigating cluttered UIs often leads to abandoned tracking.

**Personal Protein Tracker** exists to solve that. It is a local-first, minimal tracker that uses a Large Language Model (Groq + `openai/gpt-oss-120b`) to instantly interpret what you ate from raw text.

You simply type: `2 eggs and a banana` 
The AI parses: `{"eggs (x2)": 12g, "banana": 1g}` 

---

## ✨ Features

- **🗣️ Natural Language Food Logging**: No dropdowns, no searching. Just type what you ate.
- **⚡ Local-First State**: Your data never leaves your device. Everything is securely saved in `localStorage`.
- **📱 PWA Ready (Mobile-First)**: Install it to your phone's home screen. The UI is heavily polished as a "Field Notebook" theme designed specifically for portrait interaction.
- **🎯 Dynamic Suggestions**: Instantly suggests combinations of high-protein foods to help you hit your *exactly* remaining protein goal for the day.
- **🔥 Goal Streaks & Analytics**: Tracks your consecutive days hitting your goal and provides a 7-day retrospective bar chart with your weekly average.
- **💾 Export & Import**: Own your data. Export your entire history as a JSON backup to sync or switch devices.
- **🍞 Toast Notifications**: Smooth UX feedback for logging, removing, and hydrating backups.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Skeuomorphic Theme
- **Icons & UI Extras**: [Lucide React](https://lucide.dev/), [Sonner](https://sonner.emilkowal.ski/), [Recharts](https://recharts.org/)
- **AI Integration**: [Groq SDK](https://console.groq.com/docs/quickstart) (Text-to-JSON Pipeline via `openai/gpt-oss-120b`)
- **PWA**: `@ducanh2912/next-pwa`

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/personal-protein-tracker.git
cd personal-protein-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup your Environment Variables
Create a `.env.local` file in the root of the project:
```env
# Get a free API key from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_api_key_here
```
*(Note: If you leave this blank, the app will automatically fallback to a safe mock testing mode so you can experience the UI without hitting an API).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

---

## 🎨 Design Philosophy
The UI follows a **Field Notebook (Nutrition)** aesthetic. It uses soft `paper` backgrounds (`#FBF9F6`), subtle borders, standard inter typography, and minimal primary green accents (`#2F6F4E`). The ultimate goal is that using the app should feel like writing in a physical, calm journal rather than using a hyper-analytical data terminal.

---

## 🤝 Contributing
For a weekend project, the scope is purposely limited. However, pull requests that optimize the LLM output parsing, add robust `.csv` exports, or refine the PWA service workers without adding database friction are always welcome!
