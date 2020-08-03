import Fuse from 'fuse.js';

import solresolDictionary from '../../static/solresol/dictionary.json';

const flattenedSolresolDictionary = solresolDictionary.flatMap(
  ({ english = [], ...rest }) =>
    english.map((word: string) => ({ english: word, ...rest })),
);

const wordRegex = /([a-z]+)/gi;

const fuse = new Fuse<{ solresol: string; english: string }>(
  flattenedSolresolDictionary,
  {
    keys: ['english'],
    includeScore: true,
  },
);

export interface SolresolOutputItem {
  solresol: string;
  english: string[];
  preferred?: boolean;
}

export type SolresolOutput = (string | SolresolOutputItem[])[];

export const computeOutput = async (
  input: string,
): Promise<{
  output: SolresolOutput;
  hint: string;
}> => {
  const output: SolresolOutput = [];
  let hint = input;

  let previousIndex = 0;
  let hintOffset = 0;

  for (
    let matches = wordRegex.exec(input);
    matches !== null;
    matches = wordRegex.exec(input)
  ) {
    const [word] = matches;

    const translations: SolresolOutputItem[] = solresolDictionary.filter(
      // TODO: remove this optional chaining when dictionary is completed
      ({ english }) => english?.includes(word.toLowerCase()),
    );

    if (translations.length > 0) {
      const sortedTranslations = [...translations].sort(
        (a, b) =>
          a.english.indexOf(word.toLowerCase()) -
          b.english.indexOf(word.toLowerCase()),
      );

      const [preferredTranslation, ...otherTranslations] = sortedTranslations;

      output.push(
        input.slice(previousIndex, wordRegex.lastIndex - word.length),
        [
          {
            ...preferredTranslation,
            preferred: true,
          },
          ...otherTranslations,
        ],
      );

      previousIndex = wordRegex.lastIndex;

      continue;
    } else {
      output.push(input.slice(previousIndex, wordRegex.lastIndex));

      previousIndex = wordRegex.lastIndex;
    }

    const [
      { score = 1, item: { english: possibleWord = undefined } = {} } = {},
    ] = fuse.search<{ solresol: string; english: string }>(word);

    if (
      possibleWord &&
      Math.abs(word.length - possibleWord.length) < 3 &&
      score < 0.01
    ) {
      // TODO: decide whether to build an AST with the hint too or to keep it simple
      hint = `${hint.slice(
        0,
        wordRegex.lastIndex + hintOffset - word.length,
      )}${possibleWord}${hint.slice(wordRegex.lastIndex + hintOffset)}`;

      hintOffset += possibleWord.length - word.length;
    }
  }

  return { output, hint };
};
