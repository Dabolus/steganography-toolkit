import React, { FunctionComponent, useCallback, ReactNode } from 'react';

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  Link,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

export interface TopbarLayoutProps {
  title?: ReactNode;
  topbarContent?: ReactNode;
  onMenuButtonClick?(): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  appBar: {
    flex: '0 0 auto',
  },
  content: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    background: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    borderTop: `1px solid ${theme.palette.divider}`,

    '& a, & strong': {
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.primary,
    },
  },
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
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
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

      <div className={classes.content}>{children}</div>

      <footer className={classes.footer}>
        <div>
          Brought to you with <strong>❤</strong> by{' '}
          <Link href="https://github.com/Dabolus" target="my-github">
            Dabolus
          </Link>
        </div>
      </footer>
    </div>
  );
};
export default TopbarLayout;
