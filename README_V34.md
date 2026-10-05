# MIMA LABS V34

Minimal fluid responsive pass.

- Hero uses static product cards only (no carousel controls).
- Landscape hero shows three large equal cards; portrait uses a stable 2+1 card wall so covers stay readable.
- Books section uses a single fluid geometry system. Landscape shows all three books; portrait/narrow screens keep one complete book per swipe with only subtle dots.
- Removed extra product-cover badges and secondary catalog copy to reduce visual noise.
- Cover sizing is driven by viewport width + height using `min()`/`clamp()` instead of device-specific size steps.
- Existing Amazon availability, localized covers, SEO, social links, legal pages and GitHub Pages deployment remain unchanged.
