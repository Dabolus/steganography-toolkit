import { html } from '@polymer/lit-element';

import sharedStyles from '../shared-styles';

export default function template({ subroute }) {
  return html`
    ${sharedStyles}
    <lsb-tab class="page" active?="${subroute === 'lsb'}"></lsb-tab>
    <dct-3301-tab class="page" active?="${subroute === 'dct'}"></dct-3301-tab>
  `;
}
