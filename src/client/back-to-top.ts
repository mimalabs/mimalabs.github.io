export function initBackToTop(button: HTMLButtonElement): void {
  const sync = () => { button.hidden = window.scrollY <= Math.max(220, window.innerHeight * 0.7); };
  button.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  });
  window.addEventListener('scroll', sync, { passive: true });
  window.addEventListener('resize', sync, { passive: true });
  sync();
}
