import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Employers from '../pages/Employers'
import TimeSheets from '../pages/TimeSheets'
import TimeSheetsList from '../pages/TimeSheets/timeSheets'
import TimeSheet from '../pages/TimeSheets/timeSheet'


const Routes = () => (
  <Switch>
    <Route exact path="/funcionarios" component={Employers} />
    <Route exact path="/folhas-de-ponto" component={TimeSheets} />
    <Route exact path="/folhas-de-ponto/:id_user/list" component={TimeSheetsList} />
    <Route exact path="/folhas-de-ponto/:id_user/list/:id_time_sheet/edit" component={TimeSheet} />
    <Route path="*" component={TimeSheets} />
  </Switch>
)

export default Routes;
