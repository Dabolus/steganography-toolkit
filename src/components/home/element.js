import { PageViewElement } from '../page-view-element';

import template from './template';

class HomePage extends PageViewElement {
  _render(props) {
    return this::template(props);
  }
}

window.customElements.define('home-page', HomePage);
