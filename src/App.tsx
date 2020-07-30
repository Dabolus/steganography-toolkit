import React, { lazy, Suspense, useState, useCallback } from 'react';

import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { ThemeProvider, CssBaseline } from '@material-ui/core';

import lightTheme from './themes/light';

import SidebarLayout from './components/SidebarLayout';
import SidebarMenu from './components/SidebarMenu';
import Loader from './components/Loader';

import AudioRouter from './containers/audio/AudioRouter';

const Home = lazy(() => import('./components/Home'));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuButtonClick = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleSidebarItemClick = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <SidebarLayout
          menuContent={<SidebarMenu onItemClick={handleSidebarItemClick} />}
          open={sidebarOpen}
          onClose={handleSidebarClose}
        >
          <Suspense fallback={<Loader />}>
            <Switch>
              <Route exact path="/">
                <Home onMenuButtonClick={handleMenuButtonClick} />
              </Route>

              <Route path="/text">Text</Route>

              <Route path="/image">Image</Route>

              <Route path="/audio">
                <AudioRouter />
              </Route>

              <Redirect to="/" />
            </Switch>
          </Suspense>
        </SidebarLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
