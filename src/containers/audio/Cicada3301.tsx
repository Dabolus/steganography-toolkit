import React, { FunctionComponent, useState, useCallback } from 'react';

import TopbarLayout, { TopbarLayoutProps } from '../../components/TopbarLayout';
import Page from '../../components/Page';
import Cicada3301Form, {
  Cicada3301FormProps,
  Cicada3301FormValue,
} from '../../components/audio/Cicada3301Form';
import Abc from '../../components/audio/Abc';
import { nextPrime } from '../../helpers';

// TODO: this code was rushed and needs to be improved

const letterNotesMapping: Record<string, string> = {
  E: 'CC',
  T: 'GC',
  A: 'EC',
  O: 'DC',
  I: 'FC',
  N: 'AC',
  S: 'BC',
  H: 'cC',
  R: 'dC',
  D: 'CA,',
  L: 'GA,',
  C: 'EA,',
  U: 'DA,',
  M: 'FA,',
  W: 'AA,',
  F: 'BA,',
  G: 'cA,',
  Y: 'dA,',
  P: 'CG,',
  B: 'GG,',
  V: 'EG,',
  K: 'DG,',
  J: 'FG,',
  X: 'AG,',
  Q: 'BG,',
  Z: 'cG,',
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

const longNote = (note: string, length: number) =>
  note.replace(/^(.)(.*)/g, `$1${length}$2${length}`);

const computeAbc = ({
  input,
  title,
  meter: [meterBeats, meterNoteValue],
  key,
  tempo,
}: Cicada3301FormValue): string => {
  let resultStr =
    'X: 1\n' +
    `T: ${title}\n` +
    `M: ${meterBeats}/${meterNoteValue}\n` +
    `K: ${key}\n` +
    'L: 1/4\n' +
    `Q: ${tempo}\n`;

  const words = input
    .replace(/[^a-z0-9 ]/gi, '')
    .toUpperCase()
    .split(/\s+/g);

  let noteIndex = 0;

  const computedAbc = words.reduce((abc, word) => {
    if (!word) {
      return abc;
    }

    const [...letters] = word.slice(0, -1);

    const initialNotes = letters.reduce((str, letter) => {
      str += `[${letterNotesMapping[letter]}]`;

      noteIndex++;

      if (!(noteIndex % meterBeats)) {
        str += '|';
      }

      if (!(noteIndex % (4 * meterBeats))) {
        str += '\n';
      }

      return str;
    }, '');

    const lastNote = letterNotesMapping[word.slice(-1)];
    const lastNoteLength = nextPrime(word.length) - word.length + 1;

    // If adding the last note takes us to the next bar, we have to divide the note into parts

    // Available spaces in the current bar
    const availableSpace = meterBeats - (noteIndex % meterBeats);

    // Remaining notes after filling out the available space in the current bar
    const remainingNotes = lastNoteLength - availableSpace;

    // Full bars taken by the last note
    const fullBars = Math.floor(remainingNotes / meterBeats);

    // Remaining notes after filling out all the possible full bars
    const finalNotes = remainingNotes - fullBars * meterBeats;

    let finalAbc = `${abc}${initialNotes}`;

    if (remainingNotes < 1) {
      return `${finalAbc}[${longNote(lastNote, lastNoteLength)}]`;
    }

    // Fill the available space in the current bar
    finalAbc += `([${longNote(lastNote, availableSpace)}]|`;

    noteIndex += availableSpace;

    if (!(noteIndex % (4 * meterBeats))) {
      finalAbc += '\n';
    }

    // Add all the full bars
    for (let j = 0; j < fullBars; j++) {
      // If we have more full bars to add, or there are some more notes after the final full bar, we have to start a new tie
      if (j < fullBars - 1 || finalNotes > 0) {
        finalAbc += '(';
      }

      finalAbc += `[${longNote(lastNote, meterBeats)}])|`;

      noteIndex += meterBeats;

      if (!(noteIndex % (4 * meterBeats))) {
        finalAbc += '\n';
      }
    }

    // Add the final notes
    if (finalNotes > 0) {
      finalAbc += `[${longNote(lastNote, finalNotes)}])`;
    }

    return finalAbc;
  }, '');

  return `${resultStr}${computedAbc}`;
};

const Cicada3301: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [input, setInput] = useState<string>();

  const handleFormChange = useCallback<
    NonNullable<Cicada3301FormProps['onChange']>
  >((data) => {
    const abc = computeAbc(data);

    setInput(abc);
  }, []);

  return (
    <TopbarLayout title="Cicada 3301" {...props}>
      <Page>
        <Cicada3301Form onChange={handleFormChange} />
        <Abc src={input} />
      </Page>
    </TopbarLayout>
  );
};

export default Cicada3301;
