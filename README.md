# Weekly Grocery AI

A smart weekly grocery + household shopping checklist (React + Vite + MUI),
imported from the Figma Make file
[Interactive Grocery Mobile App](https://www.figma.com/make/706OsqNBoWuEerkdzWhHZg/Interactive-Grocery-Mobile-App).

## Features

- Categorized checklist (drinks, produce, meat, pantry, cleaning, **grooming**,
  **pharmacy/medical**, supplements, extras, services).
- Per-item quantity steppers, unit selector and "critical item" flags.
- Search + filter, multiple lists, light/dark mode.
- Per-store grouping with **PDF** and **WhatsApp** export.
- High-resolution product imagery with graceful fallbacks.

## Running

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build
npm run preview  # preview the production build
```

## Notes

- **Fonts:** the original Figma design referenced *SF Pro Display* (Apple-proprietary,
  not redistributable as a web font). This build uses the native system font stack
  (renders as real SF Pro on Apple devices) and loads **Inter** from Google Fonts.
- **Product images:** original items use curated Unsplash photos served at 400px;
  the newer grooming/pharmacy items use keyword placeholder photos until exact
  product shots are dropped in (each item has a "URL de imagen" field in the UI).
