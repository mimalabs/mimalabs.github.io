# MIMA LABS V31

V31 is a UI/UX refinement focused on compact landscape screens, portrait phones, and a clearer home book carousel. Content, availability, links, SEO and the GitHub Pages setup stay unchanged.

## What changed

- Hero books are materially larger on compact landscape and portrait screens.
- The hero behaves more clearly like a carousel: larger centre cover, visible neighbouring covers, arrows, dots, `01 / 03` progress and touch swipe.
- No hero autoplay was added.
- Books now use the full remaining section height instead of stacking fixed-size content.
- Compact landscape shows one large editorial product at a time: cover left, essential information right.
- Portrait shows exactly one complete product per horizontal swipe, with the cover taking the flexible space.
- Secondary descriptions are hidden first on compact screens so the cover, title and purchase/status action remain readable.
- Books have explicit previous/next controls with a `1 / 4` position indicator when the rail overflows.
- Unavailable editions stay non-clickable with one quiet `Coming soon` status.
- Existing holographic cover effects remain.

## Current live editions

- Farm — English: `https://www.amazon.com/Farm-Coloring-Toddlers-Animals-Nature/dp/B0HK7ZLTJP`
- Farm — French: `https://www.amazon.fr/Ferme-coloriage-enfants-animaux-amusement/dp/B0HK8J88KD`

All other Farm, Halloween and Christmas editions remain disabled until an Amazon URL is added in `content/products.ts`.
