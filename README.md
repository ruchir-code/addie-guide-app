# ADDIE Guide App

An interactive reference tool for beginner to intermediate Instructional Designers.

## Tech Stack
- React 18 + Vite
- React Router v6
- Tailwind CSS v3
- Lucide React icons
- localStorage for persistence (no backend)

## Getting Started

### Prerequisites
Install [Node.js](https://nodejs.org/) (v18 or later recommended).

### Install & run locally
```bash
cd addie-guide-app
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### Build for production
```bash
npm run build
```
Output goes to `dist/`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import your GitHub repo.
4. Vercel auto-detects Vite. Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Done.

The `vercel.json` at the root handles SPA routing so all routes (e.g. `/analysis`, `/glossary`) work correctly on refresh.

## Project Structure

```
src/
├── components/       # Reusable UI and layout components
├── context/          # LevelContext (beginner/advanced), ChecklistContext
├── data/             # All content as JSON files (phases, checklists, templates, glossary, bloom-verbs)
├── hooks/            # useLocalStorage
├── pages/            # One file per route
└── utils/            # clipboard helper
```

## Content Updates

All content lives in `src/data/`:
- `phases/*.json` — phase deep-dive content
- `checklists/*.json` — checklist items per phase
- `templates.json` — 8 ID templates
- `glossary.json` — 60+ glossary terms
- `bloom-verbs.json` — Bloom's taxonomy verbs by level

Edit any JSON file and rebuild to update content.
