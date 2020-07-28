import React, { FunctionComponent } from 'react';

import { Box, BoxProps, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2rem 3rem',
    background: theme.palette.background.paper,
    maxWidth: 640,
    margin: 0,

    [theme.breakpoints.up('md')]: {
      margin: `${theme.spacing(3)}px auto`,
      borderRadius: '.5rem',
      boxShadow:
        '0 .06rem .065rem 0 rgba(0, 0, 0, 0.14), 0 .003rem .15rem 0 rgba(0, 0, 0, 0.12), 0 .09rem .0035rem -.065rem rgba(0, 0, 0, 0.2)',
    },
  },
}));

const Page: FunctionComponent<BoxProps> = (props) => {
  const classes = useStyles();

  return <Box component="section" className={classes.root} {...props} />;
};

export default Page;
