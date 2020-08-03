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

import TopbarLayout, { TopbarLayoutProps } from '../../components/TopbarLayout';
import Page from '../../components/Page';

import * as SolresolWorker from '../../workers/music/solresol.worker';
import SolresolTextOutput from '../../components/music/SolresolTextOutput';

const {
  computeOutput,
} = new (SolresolWorker as any)() as typeof SolresolWorker;

const Solresol: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [input, setInput] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [output, setOutput] = useState<SolresolWorker.SolresolOutput>([]);

  const [debouncedInput] = useDebounce(input, 300);

  useEffect(() => {
    const compute = async () => {
      if (!debouncedInput) {
        setHint('');
        setOutput([]);
        return;
      }

      const {
        output: possibleOutput,
        hint: possibleHint,
      } = await computeOutput(debouncedInput);

      setOutput(possibleOutput);
      setHint(possibleHint !== debouncedInput ? possibleHint : '');
    };

    compute();
  }, [debouncedInput]);

  const handleInput = useCallback<NonNullable<OutlinedInputProps['onInput']>>(
    (event) => {
      setInput((event.target as HTMLTextAreaElement).value);
    },
    [],
  );

  const handleHintClick = useCallback(() => {
    setInput(hint);
  }, [hint]);

  const handleOutputChange = useCallback(
    (output: SolresolWorker.SolresolOutput) => {
      setOutput(output);
    },
    [],
  );

  return (
    <TopbarLayout title="Solresol" {...props}>
      <Page size="md">
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
                    rows={5}
                    value={input}
                    onInput={handleInput}
                  />
                </FormControl>
              </Grid>
              {hint && (
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Did you mean:{' '}
                    <Link
                      color="secondary"
                      role="button"
                      style={{ cursor: 'pointer' }}
                      onClick={handleHintClick}
                    >
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
              <SolresolTextOutput
                value={output}
                onChange={handleOutputChange}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Page>
    </TopbarLayout>
  );
};

export default Solresol;
