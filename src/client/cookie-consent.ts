export type ConsentChoice = 'essential' | 'all';
const storageKey = 'mimalabs-consent-v1';

/** Stores the visitor's choice locally. No analytics/cookies are enabled by either action. */
export class CookieConsentController {
  constructor(private readonly banner: HTMLElement) {}

  init(): void {
    this.banner.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((button) =>
      button.addEventListener('click', () => {
        const choice = button.dataset.consentChoice;
        if (choice !== 'all' && choice !== 'essential') return;
        this.persist(choice);
        // V6 focused a button at the very bottom of the page here. That caused
        // an unwanted scroll jump when the fixed cookie banner disappeared.
        if (this.banner.contains(document.activeElement) && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        this.hide();
      }));

    document.querySelectorAll<HTMLButtonElement>('[data-cookie-settings]').forEach((button) =>
      button.addEventListener('click', () => {
        this.show();
        this.banner.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
      }));

    if (this.read() !== 'all' && this.read() !== 'essential') this.show();
    else this.hide();

    window.addEventListener('resize', () => this.adjustFloating(), { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(() => this.adjustFloating()).observe(this.banner);
  }

  private read(): string | null {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  }
  private persist(choice: ConsentChoice): void {
    try { localStorage.setItem(storageKey, choice); } catch { /* Private file browsing can block storage. */ }
  }
  private show(): void {
    this.banner.hidden = false;
    this.adjustFloating();
  }
  private hide(): void {
    this.banner.hidden = true;
    this.adjustFloating();
  }
  private adjustFloating(): void {
    const next = this.banner.hidden ? 22 : Math.max(22, window.innerHeight - this.banner.getBoundingClientRect().top + 16);
    document.documentElement.style.setProperty('--back-to-top-offset', next + 'px');
  }
}
