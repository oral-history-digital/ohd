import React from 'react';
import ErrorBoundaryContainer from '../../containers/ErrorBoundaryContainer';
import { Route, Switch } from 'react-router-dom';

import { WrappedAccountContainer, OrderNewPasswordContainer, RegisterContainer, ActivateAccount }
    from 'modules/account';
import { HomeContainer } from 'modules/startpage';
import InterviewContainer from '../../containers/InterviewContainer';
import EditInterviewContainer from '../../containers/EditInterviewContainer';
import UploadsContainer from '../../containers/UploadsContainer';
import WrappedPeopleContainer from '../../containers/WrappedPeopleContainer';
import WrappedLanguagesContainer from '../../containers/WrappedLanguagesContainer';
import WrappedCollectionsContainer from '../../containers/WrappedCollectionsContainer';
import RegistryEntriesTreeContainer from '../../containers/RegistryEntriesTreeContainer';
import ArchiveSearchContainer from '../../containers/ArchiveSearchContainer';
import MapSearchContainer from '../../containers/MapSearchContainer';
import WrappedProjectsContainer from '../../containers/WrappedProjectsContainer';
import UserRegistrationsContainer from '../../containers/UserRegistrationsContainer';
import WrappedRolesContainer from '../../containers/WrappedRolesContainer';
import WrappedPermissionsContainer from '../../containers/WrappedPermissionsContainer';
import WrappedTaskTypesContainer from '../../containers/WrappedTaskTypesContainer';
import WrappedRegistryReferenceTypesContainer from '../../containers/WrappedRegistryReferenceTypesContainer';

export const Routes = () => (
    <Switch>
        <Route exact path="/:locale" component={props => <ErrorBoundaryContainer><HomeContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/accounts/current" component={props => <ErrorBoundaryContainer><WrappedAccountContainer {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:locale/interviews/new" component={props => <ErrorBoundaryContainer><EditInterviewContainer {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:locale/interviews/:archiveId" component={props => <ErrorBoundaryContainer><InterviewContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/uploads/new" component={props => <ErrorBoundaryContainer><UploadsContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/registry_entries" component={props => <ErrorBoundaryContainer><RegistryEntriesTreeContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/searches/archive" component={props => <ErrorBoundaryContainer><ArchiveSearchContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/searches/map" component={props => <ErrorBoundaryContainer><MapSearchContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/projects" component={props => <ErrorBoundaryContainer><WrappedProjectsContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/people" component={props => <ErrorBoundaryContainer><WrappedPeopleContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/registry_reference_types" component={props => <ErrorBoundaryContainer><WrappedRegistryReferenceTypesContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/languages" component={props => <ErrorBoundaryContainer><WrappedLanguagesContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/collections" component={props => <ErrorBoundaryContainer><WrappedCollectionsContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/roles" component={props => <ErrorBoundaryContainer><WrappedRolesContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/permissions" component={props => <ErrorBoundaryContainer><WrappedPermissionsContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/task_types" component={props => <ErrorBoundaryContainer><WrappedTaskTypesContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/user_accounts/password/new" component={props => <ErrorBoundaryContainer><OrderNewPasswordContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:locale/user_accounts/password/edit" component={props => <ErrorBoundaryContainer><ActivateAccount {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:locale/user_registrations/:resetPasswordToken/activate" component={props => <ErrorBoundaryContainer><ActivateAccount {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:locale/user_registrations/new" component={props => <ErrorBoundaryContainer><RegisterContainer {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:locale/user_registrations" component={props => <ErrorBoundaryContainer><UserRegistrationsContainer {...props} /></ErrorBoundaryContainer>} />
    </Switch>
);

export const RoutesWithProjectId = () => (
    <Switch>
        <Route exact path="/:projectId/:locale" component={props => <ErrorBoundaryContainer><HomeContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/accounts/current" component={props => <ErrorBoundaryContainer><WrappedAccountContainer {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:projectId/:locale/interviews/new" component={props => <ErrorBoundaryContainer><EditInterviewContainer {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:projectId/:locale/interviews/:archiveId" component={props => <ErrorBoundaryContainer><InterviewContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/uploads/new" component={props => <ErrorBoundaryContainer><UploadsContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/registry_entries" component={props => <ErrorBoundaryContainer><RegistryEntriesTreeContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/searches/archive" component={props => <ErrorBoundaryContainer><ArchiveSearchContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/searches/map" component={props => <ErrorBoundaryContainer><MapSearchContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/projects" component={props => <ErrorBoundaryContainer><WrappedProjectsContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/people" component={props => <ErrorBoundaryContainer><WrappedPeopleContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/registry_reference_types" component={props => <ErrorBoundaryContainer><WrappedRegistryReferenceTypesContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/languages" component={props => <ErrorBoundaryContainer><WrappedLanguagesContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/collections" component={props => <ErrorBoundaryContainer><WrappedCollectionsContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/roles" component={props => <ErrorBoundaryContainer><WrappedRolesContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/permissions" component={props => <ErrorBoundaryContainer><WrappedPermissionsContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/task_types" component={props => <ErrorBoundaryContainer><WrappedTaskTypesContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/user_accounts/password/new" component={props => <ErrorBoundaryContainer><OrderNewPasswordContainer {...props} /></ErrorBoundaryContainer>} />
        <Route path="/:projectId/:locale/user_accounts/password/edit" component={props => <ErrorBoundaryContainer><ActivateAccount {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:projectId/:locale/user_registrations/:resetPasswordToken/activate" component={props => <ErrorBoundaryContainer><ActivateAccount {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:projectId/:locale/user_registrations/new" component={props => <ErrorBoundaryContainer><RegisterContainer {...props} /></ErrorBoundaryContainer>} />
        <Route exact path="/:projectId/:locale/user_registrations" component={props => <ErrorBoundaryContainer><UserRegistrationsContainer {...props} /></ErrorBoundaryContainer>} />
    </Switch>
);
