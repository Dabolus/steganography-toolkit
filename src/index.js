/* global WebComponents */

// Styles
import './styles/main';

// Load and register pre-caching Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js', {
    scope: '/',
  }));
}

WebComponents.waitFor(() =>
  // At this point we are guaranteed that all required polyfills have
  // loaded, and can use web components APIs.
  // The standard pattern is to load element definitions that call
  // `customElements.define` here.
  // Note: returning the import's promise causes the custom elements
  // polyfill to wait until all definitions are loaded and then upgrade
  // the document in one batch, for better performance.
  import('./components/shell/element'));
