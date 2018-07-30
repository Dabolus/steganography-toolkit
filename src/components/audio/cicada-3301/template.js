import { html } from '@polymer/lit-element';

import sharedStyles from '../../shared-styles';
import styles from './styles';

export default function template(props) {
  return html`
    ${sharedStyles}
    ${styles}
    <section>
      <form>
        <label for="input">Input</label>
        <textarea id="input" placeholder="Write a text..." on-input="${(e) => this._text = e.target.value}"></textarea>
        <label for="extra">Extra</label>
        <div id="extra">
          <div>
            <label for="title">Title</label>
            <input id="title">
          </div>
          <div>
            <label id="meter-label">Meter</label>
            <div id="meter">
              <input type="number" aria-labelledby="meter-label"
                value="4" min="1" step="1" on-input="${(e) => this._beatUnit = e.target.value}">
              <span>/</span>
              <input type="number" aria-labelledby="meter-label"
                value="4" min="1" step="1" on-input="${(e) => this._beatsNum = e.target.value}">
            </div>
          </div>
          <div>
            <label for="key">Key</label>
            <input id="title">
          </div>
          <div>
            <label for="tempo">Tempo</label>
            <input type="number" id="tempo" value="90" min="1" step="1">
          </div>
        </div>
      </form>
      <label for="paper">Output</label>
      <div id="paper"></div>
    </section>
  `;
}
