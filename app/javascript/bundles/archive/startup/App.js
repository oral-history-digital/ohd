import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, hashHistory } from 'react-router-dom'

import archiveStore from '../stores/archiveStore';
import InterviewContainer from '../containers/InterviewContainer';
import SearchContainer from '../containers/SearchContainer';

const App = (props) => (
  <Provider store={archiveStore(props)}>
    <BrowserRouter history={hashHistory}>
      <div>
      <Route path="/:lang/interviews/:archiveId" component={InterviewContainer} />
      <Route path="/:lang/suchen" component={SearchContainer} />
      <Route path="/:lang/searches" component={SearchContainer} />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;

