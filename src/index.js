import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import Layout from 'components';
import { MainContainer, AddContainer } from 'containers';
import '../dist/css/style.css';

const routes = (
  <Router history={hashHistory}>
    <Route component={Layout} path="/">
      <IndexRoute component={MainContainer} />
      <Route component={AddContainer} path="add" />
    </Route>
  </Router>
);

render(routes, document.getElementById('app'));
