# Stop Being Emotionally Reactive — Interactive Workbook (v2)

An interactive companion to the 30-day print workbook. Readers get the full workbook experience plus optional "Go Deeper" sections with extended explanations, real-world examples, and additional prompts.

## Features

- **Exact workbook format** — Teaching, Reflect, Practice tabs match the print book's 3-page daily structure
- **Go Deeper sections** — Optional expandable panels on every page with extended content:
  - **Why This Matters** — deeper explanation of each day's concept
  - **Real Example** — concrete scenario illustrating the concept
  - **More Prompts** — 2-3 additional reflection questions
  - **Try This** — alternative or bonus practice exercises
- **Auto-saving entries** — text areas and checkboxes save to browser automatically
- **Progress tracking** — visual progress bar and per-week completion counts
- **Mobile-responsive** — works on phone, tablet, and desktop
- **Privacy-first** — all data stays in the browser, nothing sent to any server

## Deploy to Netlify

```bash
npm install
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main && git push -u origin main
```

Then: app.netlify.com → Add new site → Import from GitHub → select repo → Deploy.

## Local Development

```bash
npm install
npm run dev
```

## Customizing

- All content lives in `src/data.js`
- Extended content fields: `why_this_matters`, `deeper_prompts`, `try_this`, `example`
- Design tokens are at the top of `src/App.jsx` in the `T` and `F` objects
