import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Employers from '../pages/Employers'


const Routes = () => (
  <Switch>
    <Route exact path="/" component={() => <h1>Oiis</h1>} />
    <Route exact path="/funcionarios" component={Employers} />
  </Switch>
)

export default Routes;
