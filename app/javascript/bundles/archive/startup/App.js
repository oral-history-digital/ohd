import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, hashHistory } from 'react-router-dom'

import archiveStore from '../store/archiveStore';
import InterviewContainer from '../containers/InterviewContainer';
import SearchContainer from '../containers/ArchiveSearchContainer';
import RegisterContainer from '../containers/RegisterContainer';
import ActivateAccount from '../components/ActivateAccount';
import HomeContainer from '../containers/HomeContainer';

const App = (props) => (
  <Provider store={archiveStore(props)}>
    <BrowserRouter history={hashHistory}>
      <div>
          <Route exact path="/:locale" component={HomeContainer} />
          <Route path="/:locale/interviews/:archiveId" component={InterviewContainer} />
          <Route path="/:locale/searches/archive" component={SearchContainer} />
          <Route path="/:locale/user_registrations/new" component={RegisterContainer} />
          <Route path="/:locale/user_registrations/:resetPasswordToken/activate" component={ActivateAccount} />
    //"/de/user_registrations"  // registrierung ist eingegangen und wird geprüft
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;

