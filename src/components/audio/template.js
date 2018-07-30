import { html } from '@polymer/lit-element';

import sharedStyles from '../shared-styles';

export default function template({ subroute }) {
  return html`
    ${sharedStyles}
    <solresol-tab class="page" active?="${subroute === 'solresol'}"></solresol-tab>
    <cicada-3301-tab class="page" active?="${subroute === 'cicada-3301'}"></cicada-3301-tab>
  `;
}
