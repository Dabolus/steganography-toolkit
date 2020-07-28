import React from 'react';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { ThemeProvider, CssBaseline } from '@material-ui/core';

import lightTheme from './themes/light';

import SidebarLayout from './components/SidebarLayout';
import SidebarMenu from './components/SidebarMenu';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <SidebarLayout menuContent={<SidebarMenu />}>
          <Switch>
            <Route exact path="/">
              Home
            </Route>

            <Route path="/text">Text</Route>

            <Route path="/image">Image</Route>

            <Route path="/audio">Audio</Route>

            <Redirect to="/" />
          </Switch>
        </SidebarLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
