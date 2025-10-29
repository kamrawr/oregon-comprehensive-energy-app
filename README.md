# Oregon Comprehensive Energy Assessment

All-in-one, single-page web app that combines:
- Customer intake and eligibility screening (geography, utility, profile, needs)
- Income qualification (AMI/SMI/FPL) using 2025 data
- Home energy assessment (envelope, HVAC, health & safety)
- Incentive insights and prioritized retrofit pathways

Live-ready for GitHub Pages. No build step. Pure HTML/CSS/JS.

## Quick Start
- Open `index.html` directly in your browser, or
- Run a simple server to avoid any browser security quirks:
  - Python 3: `python3 -m http.server 8000` then visit http://localhost:8000

## App Structure
- `index.html` — single-page application with four modules and shared state
  1) Customer Intake → 2) Income Qualification → 3) Energy Assessment → 4) Incentive Insights
- No external dependencies other than Chart.js CDN (can be removed if charts are not used later)

## Data Notes
- 2025 Oregon AMI (county-level representative values), SMI, and Federal Poverty Guidelines embedded
- Household size adjustments applied to AMI/SMI
- Incentive logic is illustrative and can be tuned to current program rules

## Deploy to GitHub Pages
1) Create a new repo on GitHub (e.g., `oregon-comprehensive-energy-app`)
2) In this folder, run:
   ```bash
   git add .
   git commit -m "Initial commit: comprehensive energy app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/oregon-comprehensive-energy-app.git
   git push -u origin main
   ```
3) On GitHub → Settings → Pages:
   - Source: “Deploy from a branch”
   - Branch: `main` / `/ (root)`
   - Save. Your site will be live at `https://<your-username>.github.io/oregon-comprehensive-energy-app/`

Note: `.nojekyll` is included to ensure static assets load correctly without Jekyll processing.

## Customization
- Update AMI/SMI/FPL values in the JS block at the bottom of `index.html`
- Adjust program thresholds in `eligibilityResults` logic
- Extend recommendations in `generateRecommendations()`

## Disclaimer
This tool is for informational purposes only. Program eligibility varies by utility territory and administrator. Verify with Energy Trust of Oregon or your local provider.

## License
MIT