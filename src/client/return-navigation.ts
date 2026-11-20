/** Use browser history for exact scroll restoration; keep an anchored fallback for direct links. */
export function initReturnNavigation(): void {
  const backLink = document.querySelector<HTMLAnchorElement>('[data-return-to-previous]');
  if (!backLink) return;

  backLink.addEventListener('click', (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!document.referrer || window.history.length < 2) return;
    try {
      const previous = new URL(document.referrer);
      if (previous.origin !== window.location.origin || previous.pathname === window.location.pathname) return;
      event.preventDefault();
      window.history.back();
    } catch {
      // A direct visit or unavailable referrer uses the normal, accessible fallback link.
    }
  });
}
