import { LitElement } from '@polymer/lit-element';
import { installRouter } from 'pwa-helpers/router';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';
import template from './template';
import { updateMetadata } from 'pwa-helpers/metadata';


class STShell extends LitElement {
  static properties = {
    appTitle: String,
    page: String,
    _drawerOpened: Boolean,
    _narrow: Boolean,
    _subroute: String,
    _tabs: Array,
    _collapses: Object,
  };

  constructor() {
    super();
    setPassiveTouchGestures(true);
    this._drawerOpened = false;
    this._tabs = {
      home: [],
      text: [],
      image: [
        ['lsb', 'Least Significant Bit'],
        ['dct', 'Discrete Cosine Transform'],
      ],
      audio: [
        ['solresol', 'Solresol'],
        ['cicada-3301', 'Cicada 3301'],
      ],
    };
    this._collapses = {};
  }

  _render(props) {
    return this::template(props);
  }

  _firstRendered() {
    installRouter((location) => this._locationChanged(location));
  }

  _didRender(properties, changeList) {
    if ('page' in changeList) {
      const pageTitle = properties.appTitle + ' - ' + changeList.page;
      updateMetadata({
        title: pageTitle,
        description: pageTitle,
        // This object also takes an image property, that points to an img src.
      });
    }
  }

  _locationChanged() {
    let path = window.decodeURIComponent(window.location.pathname);
    if (path === '/') {
      // Redirect to home, replacing the history state.
      // In this way, the user won't be trapped in the home page when trying to go back.
      window.history.replaceState({}, '', '/home');
      path = '/home';
    }
    const [page, subroute] = path.slice(1).split('/');
    this._loadPage(page, subroute);

    // Close the drawer - in case the *path* change came from a link in the drawer.
    this._updateDrawerState(false);
  }

  _updateDrawerState(opened) {
    if (opened !== this._drawerOpened) {
      this._drawerOpened = opened;
    }
  }

  _loadPage(page, subroute) {
    import(`../${page || 'home'}/element`);
    if (subroute) {
      import(`../${page}/${subroute}/element`);
    }
    this._collapses[page] = true;
    this.page = page;
    this._subroute = subroute;
    this.setAttribute('page', page);
  }

  _toggleCollapse(page) {
    this._collapses = {
      ...this._collapses,
      [page]: !this._collapses[page],
    };
  }
}

window.customElements.define('st-shell', STShell);
