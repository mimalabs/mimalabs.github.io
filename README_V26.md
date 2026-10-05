# V26 — Coming-soon editions are fully disabled

- Localized editions without an Amazon URL are now visually shown as **in progress**.
- Their cover is softly desaturated/greyed while staying legible and premium.
- The holographic/hover effect is disabled for unavailable editions.
- The cover cannot be clicked.
- The Amazon CTA is removed; a non-interactive Coming Soon state is shown instead.
- Hero covers use the same non-interactive treatment when an edition is unavailable.
- Maintenance remains unchanged: omit a locale URL in `content/products.ts` to enable this state; add the URL later and the normal interactive state returns automatically.
