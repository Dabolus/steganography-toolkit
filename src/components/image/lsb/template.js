import { html } from '@polymer/lit-element';

import sharedStyles from '../../shared-styles';

export default function template(props) {
  return html`
    ${sharedStyles}
    ${styles}
    <section>
      <form>
        <label for="input">Input</label>
        <textarea id="input" placeholder="Write a text..." on-input="${(e) => this._text = e.target.value}"></textarea>
        <label for="image">Image</label>
        <input type="file" id="image">
      </form>

      <label for="paper">Output</label>
      <div id="paper"></div>
    </section>
  `;
}
