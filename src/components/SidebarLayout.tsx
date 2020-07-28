import React, {
  FunctionComponent,
  useCallback,
  useState,
  ReactNode,
} from 'react';

import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  Divider,
} from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';

export interface SidebarLayoutProps {
  menuContent?: ReactNode;
}

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(1.5),
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
    float: 'right',

    [theme.breakpoints.up('sm')]: {
      width: 'calc(100vw - min(100vw - 64px, 320px))',
    },
  },
}));

const SidebarLayout: FunctionComponent<SidebarLayoutProps> = ({
  menuContent,
}) => {
  const theme = useTheme();

  const classes = useStyles();

  const isNarrow = useMediaQuery(theme.breakpoints.up('sm'));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuButtonClick = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen]);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <Drawer
        anchor="left"
        variant={isNarrow ? 'permanent' : 'temporary'}
        open={isNarrow || drawerOpen}
        onClose={handleDrawerClose}
      >
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6">Steganography Toolkit</Typography>
        </Toolbar>
        <Divider />
        <div className={classes.menu}>{menuContent}</div>
      </Drawer>

      <div className={classes.content}>
        <AppBar position="sticky">
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
            <Typography variant="h6">Home</Typography>
          </Toolbar>
        </AppBar>
      </div>
    </>
  );
};
export default SidebarLayout;
