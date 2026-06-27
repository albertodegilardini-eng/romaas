# Weekly Grocery AI — Handoff & Setup (for Grok)

A React + Vite + MUI grocery & household shopping checklist for managing a
housekeeper/driver's weekly shopping. Imported from the Figma Make file
"Interactive Grocery Mobile App" and extended.

## What's in this build
- Categorized checklist (drinks, produce, meat, pantry, cleaning, GROOMING,
  PHARMACY/medical, supplements, extras, services) — Spanish UI.
- Quantity steppers, unit selector, "critical item" flags, search + filter,
  multiple lists, light/dark mode.
- BUDGET: editable prices, live running total, budget cap with under/near/over
  states, savings indicator.
- PRICE COMPARISON: per-store prices, cheapest-store highlighting, savings vs
  most expensive store.
- EXPORT: per-store-grouped PDF + WhatsApp message (prices, totals, budget,
  savings) — grouped by the CHEAPEST store per item.
- Polished custom theme (light + dark), responsive desktop/mobile.

## 1. Run locally  (Node 18+)
    npm install
    npm run dev        # dev server (Vite prints a localhost URL)
    npm run build      # production build -> dist/
    npm run preview    # preview the production build
Typecheck:  npx tsc --noEmit   (should be clean)

## 2. Apply / push to GitHub
Target repo: albertodegilardini-eng/romaas   Branch: claude/figma-dx34d7
The automated agent could NOT push (the GitHub token only had READ access -> HTTP 403).
To apply, from an account/token WITH write access:

    cd <this-folder>
    git init                      # if needed
    git checkout -b claude/figma-dx34d7
    git add -A
    git config user.email "you@example.com"
    git config user.name  "Your Name"
    git commit -m "Weekly Grocery AI: budget, price comparison, UI polish"
    git remote add origin https://github.com/albertodegilardini-eng/romaas.git
    git push -u origin claude/figma-dx34d7

(If the repo already exists locally, just copy these files over the working tree,
then add/commit/push. Commits made via the GitHub web UI are auto-signed.)

## 3. Deploy (Vercel)
Framework preset: Vite | Build command: npm run build | Output dir: dist
No environment variables required.

## 4. Notes / where to edit
- Products, categories, prices, images:  src/app/data/products.ts
- Pricing logic (cheapest store, savings): src/app/utils/pricing.ts
- Theme / header / lists:                 src/app/App.tsx
- Checklist UI + budget bar:              src/app/components/*.tsx

### Still TODO (with the owner)
- FONTS: design used "SF Pro Display" (Apple-proprietary). This build uses the
  system font stack + loads Inter from Google Fonts in index.html. No upload needed.
- IMAGES: original items use hi-res Unsplash; new grooming/pharmacy items use
  keyword placeholders. Replace with real product photos (the "imagen" field in
  src/app/data/products.ts, or the in-app "URL de imagen" field).
- PRESCRIPTION: src/app/data/products.ts has a "Receta médica (pendiente)" item in
  FARMACIA — fill in real meds/dosages.
- PRICES are seeded estimates — they get accurate as real receipt prices are entered.
- Optional next phases (need a backend): Supabase sync, receipt-OCR auto-pricing,
  PROFECO "fair price" benchmark.
