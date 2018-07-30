import { PageViewElement } from '../../page-view-element';
import abcjs from 'abcjs/midi';
import { nextPrime } from '../../utils';

import template from './template';

class Cicada3301Tab extends PageViewElement {
  static properties = {
    _text: String,
    _title: String,
    _beatUnit: Number,
    _beatsNum: Number,
    _key: String,
    _tempo: Number,
  };

  static letterNotesMapping = {
    'E': 'CC',
    'T': 'GC',
    'A': 'EC',
    'O': 'DC',
    'I': 'FC',
    'N': 'AC',
    'S': 'BC',
    'H': 'cC',
    'R': 'dC',
    'D': 'CA,',
    'L': 'GA,',
    'C': 'EA,',
    'U': 'DA,',
    'M': 'FA,',
    'W': 'AA,',
    'F': 'BA,',
    'G': 'cA,',
    'Y': 'dA,',
    'P': 'CG,',
    'B': 'GG,',
    'V': 'EG,',
    'K': 'DG,',
    'J': 'FG,',
    'X': 'AG,',
    'Q': 'BG,',
    'Z': 'cG,',
    '0': 'dG,',
    '1': 'CE,',
    '2': 'GE,',
    '3': 'EE,',
    '4': 'DE,',
    '5': 'FE,',
    '6': 'AE,',
    '7': 'BE,',
    '8': 'cE,',
    '9': 'dE,',
  };
  static longNote = (note, length) => note.replace(/^(.)(.*)/g, `$1${length}$2${length}`);

  _title = '';
  _beatUnit = 4;
  _beatsNum = 4;
  _key = 'C';
  _tempo = 90;

  ready() {
    super.ready();
    this._paper = this._root.querySelector('#paper');
  }

  get _computedABC() {
    let resultStr =
      'X: 1\n' +
      `T: ${this._title}\n` +
      `M: ${this._beatUnit}/${this._beatsNum}\n` +
      `K: ${this._key}\n` +
      'L: 1/4\n' +
      `Q: ${this._tempo}\n`;
    const words = this._text.replace(/[^a-z0-9 ]/gi, '').toUpperCase().split(/\s+/g);
    let noteIndex = 0;
    return resultStr + words.reduce((str, word) => {
      if (!word || !word.length) {
        return str;
      }
      const wordLength = word.length;
      for (let i = 0; i < wordLength - 1; i++) {
        str += `[${Cicada3301Tab.letterNotesMapping[word[i]]}]`;
        noteIndex++;
        if (!(noteIndex % this._beatUnit)) {
          str += '|';
        }
        if (!(noteIndex % (4 * this._beatUnit))) {
          str += '\n';
        }
      }
      const lastNote = Cicada3301Tab.letterNotesMapping[word[wordLength - 1]];
      const lastNoteLength = nextPrime(wordLength) - wordLength + 1;
      // If adding the last note takes us to the next bar, divide the note into parts
      const availableSpace = this._beatUnit - (noteIndex % this._beatUnit);
      const remainingNotes = (lastNoteLength - availableSpace) % this._beatUnit;
      if (Math.floor((noteIndex + lastNoteLength - 1) / this._beatUnit) > Math.floor(noteIndex / this._beatUnit)) {
        const fullBars = Math.floor((lastNoteLength - availableSpace) / this._beatUnit);
        // Fill the available space
        str += `([${Cicada3301Tab.longNote(lastNote, availableSpace)}]`;
        // Add until we reach the end of the word
        for (let j = 0; j < fullBars; j++) {
          str += `|[${Cicada3301Tab.longNote(lastNote, this._beatUnit)}]`;
        }
        // Add the rest
        str += remainingNotes ? `|[${Cicada3301Tab.longNote(lastNote, remainingNotes)}])` : ')';
        // Otherwise, just write the last note.
      } else {
        str += `[${Cicada3301Tab.longNote(lastNote, lastNoteLength)}]`;
      }
      noteIndex += lastNoteLength - 1;
      if (!(noteIndex % this._beatUnit)) {
        str += '| ';
      }
      if (!(noteIndex % (4 * this._beatUnit))) {
        str += '\n';
      }
      return str;
    }, '');
  }

  _render(props) {
    if (this._paper) {
      abcjs.renderAbc(this._paper, this._computedABC, {
        responsive: 'resize',
      });
    }
    return this::template(props);
  }
}

window.customElements.define('cicada-3301-tab', Cicada3301Tab);
