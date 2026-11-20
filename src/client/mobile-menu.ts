/** Accessible menu controller; markup and navigation also work without JS. */
export function initMobileMenu(): void {
  const menu = document.querySelector<HTMLElement>('.mobile-menu');
  const trigger = menu?.querySelector<HTMLButtonElement>('.menu-trigger');
  const panel = menu?.querySelector<HTMLElement>('.mobile-menu-panel');
  const languages = document.querySelector<HTMLDetailsElement>('.lang-details');
  if (!menu || !trigger || !panel) return;

  function setOpen(open: boolean): void {
    if (!trigger || !panel) return;
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? trigger.dataset.closeLabel ?? '' : trigger.dataset.openLabel ?? '');
    panel.hidden = !open;
    trigger.querySelector('.burger')?.classList.toggle('is-open', open);
  }
  const isOpen = () => trigger.getAttribute('aria-expanded') === 'true';
  setOpen(false);
  trigger.addEventListener('click', () => setOpen(!isOpen()));
  panel.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Node && !menu.contains(event.target)) setOpen(false);
    if (languages && event.target instanceof Node && !languages.contains(event.target)) languages.open = false;
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const wasOpen = isOpen();
    setOpen(false);
    if (languages) languages.open = false;
    if (wasOpen) trigger.focus({ preventScroll: true });
  });
}
