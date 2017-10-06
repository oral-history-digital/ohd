import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, hashHistory } from 'react-router-dom'

import archiveStore from '../stores/archiveStore';
import InterviewContainer from '../containers/InterviewContainer';
import SearchContainer from '../containers/ArchiveSearchContainer';

const App = (props) => (
  <Provider store={archiveStore(props)}>
    <BrowserRouter history={hashHistory}>
      <div>
      <Route path="/:locale/interviews/:archiveId" component={InterviewContainer} />
      <Route path="/:locale/suchen" component={SearchContainer} />
      <Route path="/:locale/searches" component={SearchContainer} />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;

