import { PageViewElement } from '../../page-view-element';

import template from './template';

class SolresolTab extends PageViewElement {
  _render(props) {
    return this::template(props);
  }
}

window.customElements.define('solresol-tab', SolresolTab);
