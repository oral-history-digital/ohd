import polyfills from '../../../lib/polyfills';
import 'intersection-observer';
import 'datalist-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom'

import archiveStore from '../store/archiveStore';
import InterviewContainer from '../containers/InterviewContainer';
import EditInterviewContainer from '../containers/EditInterviewContainer';
import UploadTranscriptContainer from '../containers/UploadTranscriptContainer';
import UploadsContainer from '../containers/UploadsContainer';
import EditPersonContainer from '../containers/EditPersonContainer';
import RegistryEntriesTreeContainer from '../containers/RegistryEntriesTreeContainer';
import ArchiveSearchContainer from '../containers/ArchiveSearchContainer';
import RegisterContainer from '../containers/RegisterContainer';
import UserRegistrationsContainer from '../containers/UserRegistrationsContainer';
import RolesContainer from '../containers/RolesContainer';
import PermissionsContainer from '../containers/PermissionsContainer';
import ActivateAccountContainer from '../containers/ActivateAccountContainer';
import OrderNewPasswordContainer from '../containers/OrderNewPasswordContainer';
import HomeContainer from '../containers/HomeContainer';

const App = (props) => (
  <Provider store={archiveStore(props)}>
    <BrowserRouter>
      <div>
          <Route exact path="/:locale" component={HomeContainer} />
          <Route exact path="/:locale/interviews/new" component={EditInterviewContainer} />
          <Route exact path="/:locale/interviews/:archiveId" component={InterviewContainer} />
          <Route path="/:locale/transcripts/new" component={UploadTranscriptContainer} />
          <Route path="/:locale/uploads/new" component={UploadsContainer} />
          <Route exact path="/:locale/people/new" component={EditPersonContainer} />
          <Route path="/:locale/registry_entries" component={RegistryEntriesTreeContainer} />
          <Route path="/:locale/searches/archive" component={ArchiveSearchContainer} />
          <Route path="/:locale/user_registrations/new" component={RegisterContainer} />
          <Route path="/:locale/user_registrations" component={UserRegistrationsContainer} />
          <Route path="/:locale/roles" render={(props) => <RolesContainer {...props} baseTabIndex={10} />} />
          <Route path="/:locale/permissions" render={(props) => <PermissionsContainer {...props} baseTabIndex={11} />} />
          <Route path="/:locale/user_accounts/password/new" component={OrderNewPasswordContainer} />
          <Route path="/:locale/user_accounts/password/edit" component={ActivateAccountContainer} />
          <Route path="/:locale/user_registrations/:resetPasswordToken/activate" component={ActivateAccountContainer} />
      </div>
    </BrowserRouter>
  </Provider>
);

export default App;

