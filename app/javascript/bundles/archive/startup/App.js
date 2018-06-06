import polyfills from '../../../lib/polyfills';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, hashHistory } from 'react-router-dom'

import archiveStore from '../store/archiveStore';
import InterviewContainer from '../containers/InterviewContainer';
import EditInterviewContainer from '../containers/EditInterviewContainer';
import SearchContainer from '../containers/ArchiveSearchContainer';
import RegisterContainer from '../containers/RegisterContainer';
import ActivateAccountContainer from '../containers/ActivateAccountContainer';
import OrderNewPasswordContainer from '../containers/OrderNewPasswordContainer';
import HomeContainer from '../containers/HomeContainer';

const App = (props) => (
  <Provider store={archiveStore(props)}>
    <BrowserRouter history={hashHistory}>
      <div>
          <Route exact path="/:locale" component={HomeContainer} />
          <Route exact path="/:locale/interviews/:archiveId" component={InterviewContainer} />
          <Route path="/:locale/interviews/:archiveId/edit" component={EditInterviewContainer} />
          <Route path="/:locale/searches/archive" component={SearchContainer} />
          <Route path="/:locale/user_registrations/new" component={RegisterContainer} />
          <Route path="/:locale/user_accounts/password/new" component={OrderNewPasswordContainer} />
          <Route path="/:locale/user_accounts/password/edit" component={ActivateAccountContainer} />
          <Route path="/:locale/user_registrations/:resetPasswordToken/activate" component={ActivateAccountContainer} />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;

