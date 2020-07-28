import React, { FunctionComponent } from 'react';

import { useRouteMatch, Switch, Route, Redirect } from 'react-router-dom';

import { TopbarLayoutProps } from '../../components/TopbarLayout';

const AudioRouter: FunctionComponent<TopbarLayoutProps> = (props) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/solresol`}>
        <Switch>
          <Route exact path={`${path}/solresol`}>
            <h1>Solresol</h1>
          </Route>

          <Redirect to={`${path}/solresol`} />
        </Switch>
      </Route>

      <Route path={`${path}/cicada-3301`}>
        <Switch>
          <Route exact path={`${path}/cicada-3301`}>
            <h1>Cicada 3301</h1>
          </Route>

          <Redirect to={`${path}/cicada-3301`} />
        </Switch>
      </Route>

      <Redirect to={`${path}/solresol`} />
    </Switch>
  );
};

export default AudioRouter;
