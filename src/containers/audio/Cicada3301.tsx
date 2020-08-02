import React, {
  FunctionComponent,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';

import { useDebounce } from 'use-debounce';

import ABCJS from 'abcjs';

import { Mp3Encoder } from 'lamejs';

import { saveAs } from 'file-saver';

import { Button, Menu, MenuItem, Box, Grid } from '@material-ui/core';

import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import TopbarLayout, { TopbarLayoutProps } from '../../components/TopbarLayout';
import Page from '../../components/Page';
import Cicada3301Form, {
  Cicada3301FormProps,
  Cicada3301FormValue,
  Language,
} from '../../components/audio/Cicada3301Form';
import Abc, { AbcProps } from '../../components/audio/Abc';
import Loader from '../../components/Loader';
import { nextPrime } from '../../helpers';

import letterNotesMapping from '../../static/cicada3301/letterNotesMapping.json';

// TODO: this code was rushed and needs to be improved

enum TieType {
  NONE,
  OPEN,
  CLOSE,
  OPEN_CLOSE,
}

const getNote = (
  language: Language,
  letter: string,
  length = 1,
  tieType = TieType.NONE,
) => {
  const letterRanking = letterNotesMapping.rankings[language].indexOf(letter);

  const notes = letterNotesMapping.notes[letterRanking];

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
  language,
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
      str += getNote(language, letter);

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
      return `${finalAbc}${getNote(language, lastLetter, lastNoteLength)}`;
    }

    // Fill the available space in the current bar
    finalAbc += `${getNote(
      language,
      lastLetter,
      availableSpace,
      TieType.OPEN,
    )}|`;

    noteIndex += availableSpace;

    if (!(noteIndex % (4 * meterBeats))) {
      finalAbc += '\n';
    }

    // Add all the full bars
    for (let j = 0; j < fullBars; j++) {
      // If we have more full bars to add, or there are some more notes after the final full bar, we have to start a new tie
      const tieType =
        j < fullBars - 1 || finalNotes > 0 ? TieType.OPEN_CLOSE : TieType.CLOSE;

      finalAbc += `${getNote(language, lastLetter, meterBeats, tieType)}|`;

      noteIndex += meterBeats;

      if (!(noteIndex % (4 * meterBeats))) {
        finalAbc += '\n';
      }
    }

    // Add the final notes
    if (finalNotes > 0) {
      finalAbc += getNote(language, lastLetter, finalNotes, TieType.CLOSE);
    }

    return finalAbc;
  }, '');

  return `${resultStr}${computedAbc}`;
};

const Cicada3301: FunctionComponent<TopbarLayoutProps> = (props) => {
  const [data, setData] = useState<Cicada3301FormValue>();
  const [input, setInput] = useState<string>();
  const [abcRenderOutput, setAbcRenderOutput] = useState<any>();
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [debouncedData] = useDebounce(data, 300);

  const exportButtonRef = useRef<HTMLButtonElement>(null);
  const abcRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedData) {
      setInput(computeAbc(debouncedData));
    }
  }, [debouncedData]);

  const handleFormChange = useCallback<
    NonNullable<Cicada3301FormProps['onChange']>
  >((data) => {
    setData(data);
  }, []);

  const handleAbcRender = useCallback<NonNullable<AbcProps['onRender']>>(
    ([output]) => {
      setAbcRenderOutput(output);
    },
    [],
  );

  const handleExportButtonClick = useCallback(async () => {
    setExportMenuOpen(true);
  }, []);

  const handleExportMenuClose = useCallback(() => {
    setExportMenuOpen(false);
  }, []);

  const handleAbcExport = useCallback(() => {
    if (!input) {
      return;
    }

    handleExportMenuClose();

    setIsExporting(true);

    const blob = new Blob([input], { type: 'text/vnd.abc' });

    saveAs(blob, `${data?.title || 'song'}.abc`);

    setIsExporting(false);
  }, [data, handleExportMenuClose, input]);

  const handleSvgExport = useCallback(() => {
    if (!abcRenderOutput || !abcRef.current) {
      return;
    }

    handleExportMenuClose();

    setIsExporting(true);

    const svg = abcRef.current.querySelector('svg')?.outerHTML;

    if (!svg) {
      return;
    }

    const transformedSvg = svg.replace(
      '<svg',
      '<svg xmlns="http://www.w3.org/2000/svg"',
    );

    const blob = new Blob([transformedSvg], { type: 'image/svg+xml' });

    saveAs(blob, `${data?.title || 'song'}.svg`);

    setIsExporting(false);
  }, [abcRenderOutput, data, handleExportMenuClose]);

  const handleWavExport = useCallback(async () => {
    if (!abcRenderOutput) {
      return;
    }

    handleExportMenuClose();

    setIsExporting(true);

    const audioContext = new AudioContext();
    await audioContext.resume();

    const midiBuffer = new ABCJS.synth.CreateSynth();
    await midiBuffer.init({
      visualObj: abcRenderOutput,
      audioContext,
      millisecondsPerMeasure: abcRenderOutput.millisecondsPerMeasure(),
      options: {
        soundFontUrl: `${process.env.PUBLIC_URL}/sounds/`,
        program: 0,
      },
    });
    await midiBuffer.prime();

    const wavUrl = midiBuffer.download();

    saveAs(wavUrl, `${data?.title || 'song'}.wav`);

    setIsExporting(false);
  }, [abcRenderOutput, data, handleExportMenuClose]);

  const handleMp3Export = useCallback(async () => {
    if (!abcRenderOutput) {
      return;
    }

    handleExportMenuClose();

    setIsExporting(true);

    const audioContext = new AudioContext();
    await audioContext.resume();

    const midiBuffer = new ABCJS.synth.CreateSynth();
    await midiBuffer.init({
      visualObj: abcRenderOutput,
      audioContext,
      millisecondsPerMeasure: abcRenderOutput.millisecondsPerMeasure(),
      options: {
        soundFontUrl: `${process.env.PUBLIC_URL}/sounds/`,
        program: 0,
      },
    });
    await midiBuffer.prime();

    const wavUrl = midiBuffer.download();

    const wavResponse = await fetch(wavUrl);

    const arrayBuffer = await wavResponse.arrayBuffer();

    const int16Array = new Int16Array(arrayBuffer);

    const encoder = new Mp3Encoder(1, 44100, 320);

    const mp3 = [encoder.encodeBuffer(int16Array), encoder.flush()];

    const blob = new Blob(mp3, { type: 'audio/mp3' });

    saveAs(blob, `${data?.title || 'song'}.mp3`);

    setIsExporting(false);
  }, [abcRenderOutput, data, handleExportMenuClose]);

  return (
    <TopbarLayout title="Cicada 3301" {...props}>
      <Page>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Cicada3301Form onChange={handleFormChange} />
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center">
              <Button
                ref={exportButtonRef}
                variant="contained"
                color="secondary"
                aria-controls="export-menu"
                aria-haspopup="true"
                endIcon={
                  exportMenuOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
                }
                onClick={handleExportButtonClick}
                disabled={!data?.input || isExporting}
              >
                {isExporting && <Loader size={24} />}
                Export as
              </Button>
              <Menu
                id="export-menu"
                getContentAnchorEl={null}
                anchorEl={exportButtonRef.current}
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'bottom',
                }}
                transformOrigin={{
                  horizontal: 'right',
                  vertical: 'top',
                }}
                keepMounted
                open={exportMenuOpen}
                onClose={handleExportMenuClose}
              >
                <MenuItem onClick={handleAbcExport}>abc</MenuItem>
                <MenuItem onClick={handleSvgExport}>SVG</MenuItem>
                <MenuItem onClick={handleWavExport}>WAV</MenuItem>
                <MenuItem onClick={handleMp3Export}>MP3</MenuItem>
              </Menu>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Abc ref={abcRef} src={input} onRender={handleAbcRender} />
          </Grid>
        </Grid>
      </Page>
    </TopbarLayout>
  );
};

export default Cicada3301;
