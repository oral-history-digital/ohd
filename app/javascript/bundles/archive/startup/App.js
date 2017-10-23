import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, hashHistory } from 'react-router-dom'

import archiveStore from '../store/archiveStore';
import InterviewContainer from '../containers/InterviewContainer';
import ArchiveSearchContainer from '../containers/ArchiveSearchContainer';
import HomeContainer from '../containers/HomeContainer';

const App = (props) => (
  <Provider store={archiveStore(props)}>
    <BrowserRouter history={hashHistory}>
      <div>
          <Route exact path="/:locale" component={HomeContainer} />
      <Route path="/:locale/interviews/:archiveId" component={InterviewContainer} />
      <Route path="/:locale/suchen" component={ArchiveSearchContainer} />
      <Route path="/:locale/searches" component={ArchiveSearchContainer} />

      </div>
    </BrowserRouter>
  </Provider>
);

export default App;

