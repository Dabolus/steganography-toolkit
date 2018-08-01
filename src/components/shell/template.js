import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-scroll-effects/effects/waterfall';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/iron-collapse/iron-collapse';
import { audioIcon, expand, homeIcon, imageIcon, menuIcon, textIcon, videoIcon } from '../icons';
import { html } from '@polymer/lit-element';

import sharedStyles from '../shared-styles';
import styles from './styles';

export default function template({ appTitle, page, _drawerOpened, _offline, _subroute, _tabs, _collapses }) {
  return html`
    ${sharedStyles}
    ${styles}
  
    <!-- Header -->
    <app-header condenses reveals effects="waterfall">
      <app-toolbar class="toolbar-top">
        <button class="menu-btn" title="Menu" on-click="${() => this._updateDrawerState(true)}">${menuIcon}</button>
        <div main-title>${appTitle}</div>
      </app-toolbar>
    
      ${_tabs[page] && _tabs[page].length > 0 ? html`
        <nav class="toolbar-list">
          ${_tabs[page].map(([key, val]) => html`
            <a selected?="${_subroute === key}" href="/${page}/${key}">${val}</a>
          `)}
        </nav>
      ` : ''}
    </app-header>
    
    <!-- Drawer content -->
    <app-drawer opened="${_drawerOpened}"
        on-opened-changed="${(e) => this._updateDrawerState(e.target.opened)}">
      <app-toolbar>Menu</app-toolbar>
      <nav class="drawer-list">
        <a selected?="${page === 'home'}" href="/home">
          <div class="icon">${homeIcon}</div>
          <div class="name">Home</div>
        </a>
        <hr>
        <button selected?="${page === 'text'}" on-click="${() => this._toggleCollapse('text')}">
          <div class="icon">${textIcon}</div>
          <div class="name">Text</div>
          <div class$="expand-collapse ${_collapses.text ? 'expanded' : ''}">${expand}</div>
        </button>
        <iron-collapse class="drawer-sublist" opened?="${_collapses.text}">
          ${_tabs.text.map(([key, val]) => html`
            <a selected?="${page === 'text' && _subroute === key}" href="/text/${key}">${val}</a>
          `)}
        </iron-collapse>
        <button selected?="${page === 'image'}" on-click="${() => this._toggleCollapse('image')}">
          <div class="icon">${imageIcon}</div>
          <div class="name">Image</div>
          <div class="expand-collapse">${expand}</div>
        </button>
        <iron-collapse class="drawer-sublist" opened?="${_collapses.image}">
          ${_tabs.image.map(([key, val]) => html`
            <a selected?="${page === 'image' && _subroute === key}" href="/image/${key}">${val}</a>
          `)}
        </iron-collapse>
        <button selected?="${page === 'audio'}" on-click="${() => this._toggleCollapse('audio')}">
          <div class="icon">${audioIcon}</div>
          <div class="name">Audio</div>
          <div class$="expand-collapse ${_collapses.audio ? 'expanded' : ''}">${expand}</div>
        </button>
        <iron-collapse class="drawer-sublist" opened?="${_collapses.audio}">
          ${_tabs.audio.map(([key, val]) => html`
            <a selected?="${page === 'audio' && _subroute === key}" href="/audio/${key}">${val}</a>
          `)}
        </iron-collapse>
        <button selected?="${page === 'view3'}">
          <div class="icon">${videoIcon}</div>
          <div class="name">Video</div>
          <div class="expand-collapse">${expand}</div>
        </button>
      </nav>
    </app-drawer>
    
    <!-- Main content -->
    <main role="main" class="main-content">
      <home-page class="page" active?="${page === 'home'}"></home-page>
      <audio-page class="page" active?="${page === 'audio'}" subroute="${_subroute}"></audio-page>
      <my-view3 class="page" active?="${page === 'view3'}"></my-view3>
      <my-view404 class="page" active?="${page === 'view404'}"></my-view404>
    </main>
    
    <footer>
      <div>Brought to you with <b>❤</b> by <a href="https://dabolus.app" target="DabolusWebsite">Dabolus</a></div>
    </footer>
  `;
}
