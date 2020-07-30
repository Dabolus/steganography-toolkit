import React, { FunctionComponent, useCallback, ReactNode } from 'react';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

export interface TopbarLayoutProps {
  title?: ReactNode;
  topbarContent?: ReactNode;
  onMenuButtonClick?(): void;
}

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(0.5),
  },
  toolbar: theme.mixins.toolbar,
  menu: {
    width: 'min(100vw - 56px, 280px)',

    [theme.breakpoints.up('sm')]: {
      width: 'min(100vw - 64px, 320px)',
    },
  },
  content: {
    width: '100vw',
    minHeight: '100vh',
    float: 'right',
    position: 'relative',

    [theme.breakpoints.up('sm')]: {
      width: 'calc(100vw - min(100vw - 64px, 320px))',
    },
  },
}));

const TopbarLayout: FunctionComponent<TopbarLayoutProps> = ({
  title = 'Steganography Toolkit',
  topbarContent,
  onMenuButtonClick,
  children,
}) => {
  const theme = useTheme();

  const classes = useStyles();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  const handleMenuButtonClick = useCallback(() => {
    onMenuButtonClick?.();
  }, [onMenuButtonClick]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {!isNarrow && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuButtonClick}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6">{title}</Typography>
        </Toolbar>

        {topbarContent}
      </AppBar>

      {children}
    </>
  );
};
export default TopbarLayout;
