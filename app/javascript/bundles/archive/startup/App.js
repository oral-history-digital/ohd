import polyfills from '../../../lib/polyfills'; 
import '@babel/polyfill';
import 'intersection-observer';
import 'datalist-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom'

import archiveStore from '../store/archiveStore';
import WrappedAccountContainer from '../containers/WrappedAccountContainer';
import InterviewContainer from '../containers/InterviewContainer';
import EditInterviewContainer from '../containers/EditInterviewContainer';
import UploadTranscriptContainer from '../containers/UploadTranscriptContainer';
import UploadsContainer from '../containers/UploadsContainer';
import EditPersonContainer from '../containers/EditPersonContainer';
import RegistryEntriesTreeContainer from '../containers/RegistryEntriesTreeContainer';
import ArchiveSearchContainer from '../containers/ArchiveSearchContainer';
import RegisterContainer from '../containers/RegisterContainer';
import WrappedProjectsContainer from '../containers/WrappedProjectsContainer';
import UserRegistrationsContainer from '../containers/UserRegistrationsContainer';
import WrappedRolesContainer from '../containers/WrappedRolesContainer';
import WrappedPermissionsContainer from '../containers/WrappedPermissionsContainer';
import ActivateAccountContainer from '../containers/ActivateAccountContainer';
import OrderNewPasswordContainer from '../containers/OrderNewPasswordContainer';
import HomeContainer from '../containers/HomeContainer';

const App = (props) => (
    <Provider store={archiveStore(props)}>
        <BrowserRouter>
            <div>
                <Route exact path="/:projectId/:locale" component={HomeContainer} />
                <Route path="/:projectId/:locale/accounts/current" component={WrappedAccountContainer} />
                <Route exact path="/:projectId/:locale/interviews/new" component={EditInterviewContainer} />
                <Route exact path="/:projectId/:locale/interviews/:archiveId" component={InterviewContainer} />
                <Route path="/:projectId/:locale/transcripts/new" component={UploadTranscriptContainer} />
                <Route path="/:projectId/:locale/uploads/new" component={UploadsContainer} />
                <Route exact path="/:projectId/:locale/people/new" component={EditPersonContainer} />
                <Route path="/:projectId/:locale/registry_entries" component={RegistryEntriesTreeContainer} />
                <Route path="/:projectId/:locale/searches/archive" component={ArchiveSearchContainer} />
                <Route path="/:projectId/:locale/projects" component={WrappedProjectsContainer} />
                <Route path="/:projectId/:locale/roles" component={WrappedRolesContainer} />
                <Route path="/:projectId/:locale/permissions" component={WrappedPermissionsContainer} />
                <Route path="/:projectId/:locale/user_accounts/password/new" component={OrderNewPasswordContainer} />
                <Route path="/:projectId/:locale/user_accounts/password/edit" component={ActivateAccountContainer} />
                <Route exact path="/:projectId/:locale/user_registrations/:resetPasswordToken/activate" component={ActivateAccountContainer} />
                <Route exact path="/:projectId/:locale/user_registrations/new" component={RegisterContainer} />
                <Route exact path="/:projectId/:locale/user_registrations" component={UserRegistrationsContainer} />
            </div>
        </BrowserRouter>
    </Provider>
);

export default App;

