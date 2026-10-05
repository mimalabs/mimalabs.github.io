# MIMA LABS V23 — Viewport alignment correction

V23 is intentionally based on **V21**, not V22. The V21 header/navbar dimensions and responsive design are preserved exactly.

## What changed

- Each home section now owns exactly the visual viewport remaining below the existing sticky header.
- Hero, Books, Opinions, Contact, and Footer snap to homogeneous page-sized positions.
- Navigation uses **one** header-offset model (`scroll-padding-top`). The duplicate `scroll-margin-top` offset that could make anchored sections land too low is neutralized on the home sections.
- No runtime code changes the header height or forces the navbar to shrink.
- Portrait still keeps one complete Book / Opinion item per horizontal swipe.
- Short viewports trim secondary text before primary visuals can overflow.
- Legal/information pages retain normal document scrolling; the viewport-page behavior is scoped only to the home page.

## Responsive model

- Large landscape: one selected section fills all space below the navbar.
- Medium/tablet: same section isolation, with horizontal rails only when required.
- Portrait phone: one vertical section per viewport and one horizontal product/review per swipe.

All SEO, localized covers, Coming Soon logic, hamburger navigation, social links, analytics/cookie controls, and legal routes from V21 remain intact.
