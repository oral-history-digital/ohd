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
import WrappedPeopleContainer from '../containers/WrappedPeopleContainer';
import WrappedLanguagesContainer from '../containers/WrappedLanguagesContainer';
import WrappedCollectionsContainer from '../containers/WrappedCollectionsContainer';
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
                <Route exact path="/:locale" component={props => <HomeContainer {...props} />} />
                <Route path="/:locale/accounts/current" component={props => <WrappedAccountContainer {...props} />} />
                <Route exact path="/:locale/interviews/new" component={props => <EditInterviewContainer {...props} />} />
                <Route exact path="/:locale/interviews/:archiveId" component={props => <InterviewContainer {...props} />} />
                <Route path="/:locale/transcripts/new" component={props => <UploadTranscriptContainer {...props} />} />
                <Route path="/:locale/uploads/new" component={props => <UploadsContainer {...props} />} />
                <Route path="/:locale/registry_entries" component={props => <RegistryEntriesTreeContainer {...props} />} />
                <Route path="/:locale/searches/archive" component={props => <ArchiveSearchContainer {...props} />} />
                <Route path="/:locale/projects" component={props => <WrappedProjectsContainer {...props} />} />
                <Route path="/:locale/people" component={props => <WrappedPeopleContainer {...props} />} />
                <Route path="/:locale/languages" component={props => <WrappedLanguagesContainer {...props} />} />
                <Route path="/:locale/collections" component={props => <WrappedCollectionsContainer {...props} />} />
                <Route path="/:locale/roles" component={props => <WrappedRolesContainer {...props} />} />
                <Route path="/:locale/permissions" component={props => <WrappedPermissionsContainer {...props} />} />
                <Route path="/:locale/user_accounts/password/new" component={props => <OrderNewPasswordContainer {...props} />} />
                <Route path="/:locale/user_accounts/password/edit" component={props => <ActivateAccountContainer {...props} />} />
                <Route exact path="/:locale/user_registrations/:resetPasswordToken/activate" component={props => <ActivateAccountContainer {...props} />} />
                <Route exact path="/:locale/user_registrations/new" component={props => <RegisterContainer {...props} />} />
                <Route exact path="/:locale/user_registrations" component={props => <UserRegistrationsContainer {...props} />} />
            </div>
        </BrowserRouter>
    </Provider>
);

export default App;

