import { initMobileMenu } from './mobile-menu.js';
import { CookieConsentController } from './cookie-consent.js';
import { initBackToTop } from './back-to-top.js';
import { initReturnNavigation } from './return-navigation.js';

function init(): void {
  initMobileMenu();
  initReturnNavigation();
  const banner = document.getElementById('cookie-consent');
  if (banner) new CookieConsentController(banner).init();
  const toTop = document.querySelector<HTMLButtonElement>('#back-to-top');
  if (toTop) initBackToTop(toTop);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
