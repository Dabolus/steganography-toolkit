import { PageViewElement } from '../page-view-element';

import template from './template';

class AudioPage extends PageViewElement {
  static properties = {
    subroute: String,
  };

  _render(props) {
    return this::template(props);
  }
}

window.customElements.define('audio-page', AudioPage);
