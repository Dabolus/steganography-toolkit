import React, {
  FunctionComponent,
  Fragment,
  useCallback,
  MouseEventHandler,
  useState,
} from 'react';

import { makeStyles, Menu, MenuItem, Typography } from '@material-ui/core';

import type {
  SolresolOutput as SolresolWorkerOutput,
  SolresolOutputItem,
} from '../../workers/music/solresol.worker';

export type SolresolOutputType =
  | 'full'
  | 'abbreviated'
  | 'english'
  | 'numeric'
  | 'color'
  | 'stenographic';

export interface SolresolOutputProps {
  type?: SolresolOutputType;
  value?: SolresolWorkerOutput;
  onChange?(output: SolresolWorkerOutput): void;
}

const useStyles = makeStyles((theme) => ({
  container: {
    whiteSpace: 'pre-wrap',
    padding: '18.5px 14px',
    fontSize: '1rem',
    borderRadius: '4px',
    lineHeight: '1.1876em',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    height: '8.25rem',
    cursor: 'text',
    overflowX: 'auto',
  },
  translation: {
    appearance: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '4px',
    background: 'transparent',
    outline: 'none',
    transition: '.3s border-color',
    fontWeight: theme.typography.fontWeightBold,
    lineHeight: 0.9,

    '&:hover, &:focus': {
      borderColor: theme.palette.text.disabled,
    },
  },
  menu: {
    width: 280,
    minHeight: 72,
  },
  alternative: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',

    '& > *': {
      whiteSpace: 'normal',
    },
  },
}));

const fullSolresolCodes = [null, 'do', 're', 'mi', 'fa', 'sol', 'la', 'si'];
const abbreviatedSolresolCodes = [null, 'd', 'r', 'm', 'f', 'so', 'l', 's'];
const englishSolresolCodes = [null, 'C', 'D', 'E', 'F', 'G', 'A', 'B'];

const SolresolOutput: FunctionComponent<SolresolOutputProps> = ({
  type = 'full',
  value,
  onChange,
}) => {
  const classes = useStyles();

  const [selectedTranslation, setSelectedTranslation] = useState<{
    index: number;
    anchor: HTMLElement;
  }>();

  const convertToSolresolForm = useCallback(
    (word: string) => {
      switch (type) {
        case 'full':
          return [...word].map((code) => fullSolresolCodes[Number(code)]);
        case 'abbreviated':
          return [...word].map(
            (code) => abbreviatedSolresolCodes[Number(code)],
          );
        case 'english':
          return [...word].map((code) => englishSolresolCodes[Number(code)]);
        case 'numeric':
          return word;
        case 'color':
          // TODO
          return;
        case 'stenographic':
          // TODO
          return;
      }
    },
    [type],
  );

  const createTranslationClickHandler = useCallback(
    (index: number): MouseEventHandler<HTMLElement> => (event) => {
      setSelectedTranslation({
        index,
        anchor: event.target as HTMLElement,
      });
    },
    [],
  );

  const handleAlternativeTranslationsMenuClose = useCallback(() => {
    setSelectedTranslation(undefined);
  }, []);

  const createTranslationPreferenceChangeHandler = useCallback(
    (index: number) => () => {
      if (!selectedTranslation || !value || !onChange) {
        return;
      }

      onChange([
        ...value.slice(0, selectedTranslation.index),
        (value[selectedTranslation.index] as SolresolOutputItem[]).map(
          (item, itemIndex) => ({
            ...item,
            preferred: itemIndex === index,
          }),
        ),
        ...value.slice(selectedTranslation.index + 1),
      ]);

      handleAlternativeTranslationsMenuClose();
    },
    [
      selectedTranslation,
      onChange,
      value,
      handleAlternativeTranslationsMenuClose,
    ],
  );

  return (
    <>
      <div className={classes.container}>
        {value?.map((part, index) => {
          if (typeof part === 'string') {
            return <Fragment key={index}>{part}</Fragment>;
          }

          return (
            <button
              key={index}
              aria-controls="alternative-translations-menu"
              aria-haspopup="true"
              onClick={createTranslationClickHandler(index)}
              className={classes.translation}
            >
              {convertToSolresolForm(
                part.find(({ preferred }) => preferred)?.solresol || '',
              )}
            </button>
          );
        })}
      </div>
      <Menu
        id="alternative-translations-menu"
        getContentAnchorEl={null}
        anchorEl={selectedTranslation?.anchor}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        keepMounted
        open={Boolean(selectedTranslation)}
        onClose={handleAlternativeTranslationsMenuClose}
        PaperProps={{ className: classes.menu }}
      >
        {value &&
          selectedTranslation &&
          (value[selectedTranslation.index] as SolresolOutputItem[]).map(
            ({ solresol, english, preferred }, index) => (
              <MenuItem
                key={solresol}
                selected={preferred}
                onClick={createTranslationPreferenceChangeHandler(index)}
              >
                <div className={classes.alternative}>
                  <Typography variant="subtitle1">
                    <strong>{convertToSolresolForm(solresol)}</strong>
                  </Typography>
                  <Typography variant="caption">
                    {english.join(' · ')}
                  </Typography>
                </div>
              </MenuItem>
            ),
          )}
      </Menu>
    </>
  );
};

export default SolresolOutput;
