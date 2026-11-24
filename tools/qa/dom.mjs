/** Exercises generated HTML and the real client bundle through happy-dom. */
import { Window } from 'happy-dom';
import { readSite, origin } from './support.mjs';

export function openPage(pagePath, javascript = '') {
  const window = new Window({ url: `${origin}/${pagePath}` });
  window.document.write(readSite(...pagePath.split('/')));
  window.document.close();
  if (javascript) startClient(window, javascript);
  return window;
}

export function click(window, element) {
  const event = new window.MouseEvent('click', {
    button: 0, bubbles: true, cancelable: true,
  });
  element.dispatchEvent(event);
  return event;
}

export function startClient(window, javascript) {
  window.eval(javascript);
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
}
