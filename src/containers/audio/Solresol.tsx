import React, {
  FunctionComponent,
  useState,
  useCallback,
  useEffect,
} from 'react';

import {
  OutlinedInputProps,
  Grid,
  Link,
  Typography,
  FormControl,
  FormLabel,
  Box,
  OutlinedInput,
} from '@material-ui/core';

import { useDebounce } from 'use-debounce';

import useFuse from '../../hooks/useFuse';

import solresolDictionary from '../../static/solresol/dictionary.json';
import TopbarLayout, { TopbarLayoutProps } from '../../components/TopbarLayout';
import Page from '../../components/Page';

const Solresol: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [input, setInput] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const [debouncedInput] = useDebounce(input, 300);

  const { search } = useFuse<{ solresol: string; english: string }>(
    solresolDictionary,
    {
      keys: ['english'],
      includeMatches: true,
      includeScore: true,
    },
  );

  useEffect(() => {
    if (!debouncedInput) {
      setHint('');
      setOutput('');
      return;
    }

    const regex = /([a-z]+)/gi;

    let possibleOutput = debouncedInput;
    let possibleHint = debouncedInput;

    let outputOffset = 0;
    let hintOffset = 0;

    for (
      let matches = regex.exec(debouncedInput);
      matches !== null;
      matches = regex.exec(debouncedInput)
    ) {
      const [word] = matches;

      const translation = solresolDictionary.find(({ english }) =>
        english?.includes(word.toLowerCase()),
      )?.solresol;

      if (translation) {
        possibleOutput = `${possibleOutput.slice(
          0,
          regex.lastIndex + outputOffset - word.length,
        )}${translation}${possibleOutput.slice(
          regex.lastIndex + outputOffset,
        )}`;

        outputOffset += translation.length - word.length;

        continue;
      }

      const [
        {
          score = 1,
          matches: [{ value: possibleWord = undefined } = {}] = [],
        } = {},
      ] = search(word);

      if (possibleWord && score < 0.01) {
        possibleHint = `${possibleHint.slice(
          0,
          regex.lastIndex + hintOffset - word.length,
        )}${possibleWord}${possibleHint.slice(regex.lastIndex + hintOffset)}`;

        hintOffset += possibleWord.length - word.length;
      }
    }

    setOutput(possibleOutput);
    setHint(possibleHint !== debouncedInput ? possibleHint : '');
  }, [debouncedInput, search]);

  const handleInput = useCallback<NonNullable<OutlinedInputProps['onInput']>>(
    (event) => {
      setInput((event.target as HTMLTextAreaElement).value);
    },
    [],
  );

  const handleHintClick = useCallback(() => {
    setInput(hint);
  }, [hint]);

  return (
    <TopbarLayout title="Solresol" {...props}>
      <Page>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Box marginBottom={1} clone>
                    <FormLabel>Input</FormLabel>
                  </Box>
                  <OutlinedInput
                    multiline
                    rows={4}
                    value={input}
                    onInput={handleInput}
                  />
                </FormControl>
              </Grid>
              {hint && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Did you mean:{' '}
                    <Link color="secondary" onClick={handleHintClick}>
                      {hint}
                    </Link>
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Box marginBottom={1} clone>
                <FormLabel>Output</FormLabel>
              </Box>
              <OutlinedInput multiline readOnly rows={4} value={output} />
            </FormControl>
          </Grid>
        </Grid>
      </Page>
    </TopbarLayout>
  );
};

export default Solresol;
