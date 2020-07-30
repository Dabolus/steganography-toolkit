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

const letterNotesMapping: Record<string, string[]> = {
  E: ['C', 'C'],
  T: ['G', 'C'],
  A: ['E', 'C'],
  O: ['D', 'C'],
  I: ['F', 'C'],
  N: ['A', 'C'],
  S: ['B', 'C'],
  H: ['c', 'C'],
  R: ['d', 'C'],
  D: ['C', 'A,'],
  L: ['G', 'A,'],
  C: ['E', 'A,'],
  U: ['D', 'A,'],
  M: ['F', 'A,'],
  W: ['A', 'A,'],
  F: ['B', 'A,'],
  G: ['c', 'A,'],
  Y: ['d', 'A,'],
  P: ['C', 'G,'],
  B: ['G', 'G,'],
  V: ['E', 'G,'],
  K: ['D', 'G,'],
  J: ['F', 'G,'],
  X: ['A', 'G,'],
  Q: ['B', 'G,'],
  Z: ['c', 'G,'],
  '0': ['d', 'G,'],
  '1': ['C', 'E,'],
  '2': ['G', 'E,'],
  '3': ['E', 'E,'],
  '4': ['D', 'E,'],
  '5': ['F', 'E,'],
  '6': ['A', 'E,'],
  '7': ['B', 'E,'],
  '8': ['c', 'E,'],
  '9': ['d', 'E,'],
};

enum TieType {
  NONE,
  OPEN,
  CLOSE,
  OPEN_CLOSE,
}

const getNote = (letter: string, length = 1, tieType = TieType.NONE) => {
  const notes = letterNotesMapping[letter];

  return `[${notes.reduce(
    (finalNote, note) =>
      `${finalNote}${
        tieType === TieType.OPEN || tieType === TieType.OPEN_CLOSE ? '(' : ''
      }${note}${
        tieType === TieType.CLOSE || tieType === TieType.OPEN_CLOSE ? ')' : ''
      }${length > 1 ? length : ''}`,
    '',
  )}]`;
};

const computeAbc = ({
  input,
  title,
  meter: [meterBeats, meterNoteValue],
  key,
  tempo,
}: Cicada3301FormValue): string => {
  let resultStr = [
    'X: 1\n',
    ...(title ? [`T: ${title}\n`] : []),
    `M: ${meterBeats}/${meterNoteValue}\n`,
    ...(key ? [`K: ${key}\n`] : []),
    'L: 1/4\n',
    `Q: ${tempo}\n`,
  ].join('');

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
      str += getNote(letter);

      noteIndex++;

      if (!(noteIndex % meterBeats)) {
        str += '|';
      }

      if (!(noteIndex % (4 * meterBeats))) {
        str += '\n';
      }

      return str;
    }, '');

    const lastLetter = word.slice(-1);
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
      return `${finalAbc}${getNote(lastLetter, lastNoteLength)}`;
    }

    // Fill the available space in the current bar
    finalAbc += `${getNote(lastLetter, availableSpace, TieType.OPEN)}|`;

    noteIndex += availableSpace;

    if (!(noteIndex % (4 * meterBeats))) {
      finalAbc += '\n';
    }

    // Add all the full bars
    for (let j = 0; j < fullBars; j++) {
      // If we have more full bars to add, or there are some more notes after the final full bar, we have to start a new tie
      const tieType =
        j < fullBars - 1 || finalNotes > 0 ? TieType.OPEN_CLOSE : TieType.CLOSE;

      finalAbc += `${getNote(lastLetter, meterBeats, tieType)}|`;

      noteIndex += meterBeats;

      if (!(noteIndex % (4 * meterBeats))) {
        finalAbc += '\n';
      }
    }

    // Add the final notes
    if (finalNotes > 0) {
      finalAbc += getNote(lastLetter, finalNotes, TieType.CLOSE);
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
