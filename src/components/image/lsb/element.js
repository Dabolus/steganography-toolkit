import { PageViewElement } from '../../page-view-element';

import template from './template';

class LSBTab extends PageViewElement {
  static properties = {
    _text: String,
  };

  _render(props) {
    return this::template(props);
  }
}

window.customElements.define('lsb-tab', LSBTab);
