MIMA LABS V21

Fixes
- Anchor navigation now lands sections precisely below the sticky header using
  global scroll-padding + explicit section scroll-margin.
- Landscape Books layout rebuilt to use remaining viewport height dynamically.
- Covers are larger because they now consume all free card height before the
  compact product metadata, rather than using conservative vh width clamps.
- All covers remain fully visible and optically aligned.
- Short landscape screens progressively hide non-essential copy before ever
  clipping the cover or overflowing the viewport.
