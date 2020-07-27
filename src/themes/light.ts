import { createMuiTheme } from '@material-ui/core';

import { enUS } from '@material-ui/core/locale';

const lightTheme = createMuiTheme(
  {
    typography: {
      fontFamily: "'Jost*', sans-serif",
    },
    palette: {
      primary: {
        main: '#212121',
      },
      secondary: {
        main: '#00c853',
      },
    },
  },
  enUS,
);

export default lightTheme;
