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
  Select,
  InputLabel,
  SelectProps,
} from '@material-ui/core';

import { useDebounce } from 'use-debounce';

import TopbarLayout, { TopbarLayoutProps } from '../../components/TopbarLayout';
import Page from '../../components/Page';

import * as SolresolWorker from '../../workers/music/solresol.worker';
import SolresolOutput, {
  SolresolOutputType,
} from '../../components/music/SolresolOutput';

const {
  computeOutput,
} = new (SolresolWorker as any)() as typeof SolresolWorker;

const Solresol: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [input, setInput] = useState<string>('');
  const [hint, setHint] = useState<string>('');
  const [output, setOutput] = useState<SolresolWorker.SolresolOutput>([]);
  const [outputType, setOutputType] = useState<SolresolOutputType>('full');

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

  const handleOutputTypeChange = useCallback<
    NonNullable<SelectProps['onChange']>
  >((event) => {
    setOutputType(event.target.value as SolresolOutputType);
  }, []);

  return (
    <TopbarLayout title="Solresol" {...props}>
      <Page size="md">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Box
                    display="flex"
                    alignItems="center"
                    marginBottom={1}
                    height={48}
                  >
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                marginBottom={1}
                height={48}
              >
                <FormLabel>Output</FormLabel>
                <FormControl>
                  <InputLabel
                    shrink
                    id="demo-simple-select-placeholder-label-label"
                  >
                    Type
                  </InputLabel>
                  <Select
                    native
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    value={outputType}
                    onChange={handleOutputTypeChange}
                  >
                    <option value="full">Full</option>
                    <option value="abbreviated">Abbreviated</option>
                    <option value="english">English</option>
                    <option value="numeric">Numeric</option>
                    {/* <option value="color">Color</option>
                    <option value="stenographic">Stenographic</option> */}
                  </Select>
                </FormControl>
              </Box>
              <SolresolOutput
                type={outputType}
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
