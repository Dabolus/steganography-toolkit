import Fuse from 'fuse.js';

import rawSolresolDictionary from '../../static/solresol/dictionary.json';

const solresolDictionary = rawSolresolDictionary.flatMap(
  ({ english = [], ...rest }) =>
    english.map((word: string) => ({ english: word, ...rest })),
);

const wordRegex = /([a-z]+)/gi;

const fuse = new Fuse<{ solresol: string; english: string }>(
  solresolDictionary,
  {
    keys: ['english'],
    includeScore: true,
  },
);

export const computeOutput = async (
  input: string,
): Promise<{ output: string; hint: string }> => {
  let output = input;
  let hint = input;

  let outputOffset = 0;
  let hintOffset = 0;

  for (
    let matches = wordRegex.exec(input);
    matches !== null;
    matches = wordRegex.exec(input)
  ) {
    const [word] = matches;

    const translation = solresolDictionary.find(
      ({ english }) => english === word.toLowerCase(),
    )?.solresol;

    if (translation) {
      output = `${output.slice(
        0,
        wordRegex.lastIndex + outputOffset - word.length,
      )}${translation}${output.slice(wordRegex.lastIndex + outputOffset)}`;

      outputOffset += translation.length - word.length;

      continue;
    }

    const [
      { score = 1, item: { english: possibleWord = undefined } = {} } = {},
    ] = fuse.search<{ solresol: string; english: string }>(word);

    if (
      possibleWord &&
      Math.abs(word.length - possibleWord.length) < 3 &&
      score < 0.01
    ) {
      hint = `${hint.slice(
        0,
        wordRegex.lastIndex + hintOffset - word.length,
      )}${possibleWord}${hint.slice(wordRegex.lastIndex + hintOffset)}`;

      hintOffset += possibleWord.length - word.length;
    }
  }

  return { output, hint };
};
