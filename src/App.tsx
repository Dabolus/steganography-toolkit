import React from 'react';

import { ThemeProvider, CssBaseline } from '@material-ui/core';

import lightTheme from './themes/light';

import SidebarLayout from './components/SidebarLayout';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <SidebarLayout />
    </ThemeProvider>
  );
}

export default App;
