# ScentLab MY — Fragrance discovery website

A complete beginner-friendly static website. No accounts, no npm, no build tool, and no server-side database required.

## Run it

1. Open the `scentlab-my` folder in VS Code.
2. Install the **Live Server** VS Code extension if you don't have it.
3. Right-click `index.html` → **Open with Live Server**.
4. Or upload the contents of `scentlab-my` to a GitHub Pages repository and enable Pages.

Do not double-click `index.html` as a `file://` URL: its ES-module script may be blocked by the browser's security policy. Use Live Server or GitHub Pages.

## Files and what they do

- `index.html`: page sections, headings, inputs, buttons, dialogs.
- `css/style.css`: styling, layout and responsiveness.
- `js/data.js`: source-linked perfume catalogue (one object per fragrance).
- `js/app.js`: search, cards, filters, comparison, finder, wishlist, personal ratings.

## Learn the code (recommended order)

1. `index.html`: find `<header>`, `<section>`, `<input>`, `<button>`.
2. `css/style.css`: change `--olive`, `--cream`, `--gold` at the top.
3. `js/data.js`: understand the array of objects. Add a fragrance from an official source.
4. `js/app.js`: understand `renderCards()`, `filteredPerfumes()`, `addEventListener()`, `findMatches()`.

## Important data notes

Catalogue is a small editorial starter dataset checked against official product listings on 2026-11-16. Prices are snapshots (not live). Some products have partial or missing official note pyramids. Editorial accords and families are not consumer poll results. No invented public ratings or longevity statistics.

Wishlist and personal ratings are stored in `localStorage` on this device only. Browser data can be deleted and will not synchronize. The recommendation score is a simple transparent rule-based **match percentage**, not a review score or a measured likelihood.

Perfume bottle graphics are CSS-made illustrations to avoid using unlicensed product imagery. Brand names are presented descriptively and do not imply endorsement or affiliation.

## Exercises

1. Change the hero heading in `index.html`.
2. Change `--olive` in CSS to another color and see the site update.
3. Add a new *verified* fragrance to `js/data.js` (copy an object, change the ID and source).
4. Change the scoring weights in `findMatches()` and explain how your results change.
5. Add a new catalogue filter for fragrance `size` or a maximum price preset.
