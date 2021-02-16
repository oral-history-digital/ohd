import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ErrorBoundary } from 'modules/react-toolbox';
import { WrappedAccountContainer, OrderNewPasswordContainer, RegisterContainer, ActivateAccount }
    from 'modules/account';
import { HomeContainer } from 'modules/startpage';
import { InterviewContainer } from 'modules/interview';
import { UserRegistrationsContainer } from 'modules/users';
import { RegistryContainer } from 'modules/registry';
import { ArchiveSearchContainer } from 'modules/search';
import { MapSearchContainer } from 'modules/map-search';
import { WrappedProjectsContainer, WrappedRolesContainer,
    WrappedPermissionsContainer, WrappedTaskTypesContainer, WrappedRegistryReferenceTypesContainer,
    WrappedPeopleContainer, WrappedLanguagesContainer, WrappedCollectionsContainer,
    UploadsContainer, EditInterviewContainer } from 'modules/admin';

export const Routes = () => (
    <Switch>
        <Route exact path="/:locale" component={props => <ErrorBoundary><HomeContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/accounts/current" component={props => <ErrorBoundary><WrappedAccountContainer {...props} /></ErrorBoundary>} />
        <Route exact path="/:locale/interviews/new" component={props => <ErrorBoundary><EditInterviewContainer {...props} /></ErrorBoundary>} />
        <Route exact path="/:locale/interviews/:archiveId" component={props => <ErrorBoundary><InterviewContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/uploads/new" component={props => <ErrorBoundary><UploadsContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/registry_entries" component={props => <ErrorBoundary><RegistryContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/searches/archive" component={props => <ErrorBoundary><ArchiveSearchContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/searches/map" component={props => <ErrorBoundary><MapSearchContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/projects" component={props => <ErrorBoundary><WrappedProjectsContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/people" component={props => <ErrorBoundary><WrappedPeopleContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/registry_reference_types" component={props => <ErrorBoundary><WrappedRegistryReferenceTypesContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/languages" component={props => <ErrorBoundary><WrappedLanguagesContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/collections" component={props => <ErrorBoundary><WrappedCollectionsContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/roles" component={props => <ErrorBoundary><WrappedRolesContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/permissions" component={props => <ErrorBoundary><WrappedPermissionsContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/task_types" component={props => <ErrorBoundary><WrappedTaskTypesContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/user_accounts/password/new" component={props => <ErrorBoundary><OrderNewPasswordContainer {...props} /></ErrorBoundary>} />
        <Route path="/:locale/user_accounts/password/edit" component={props => <ErrorBoundary><ActivateAccount {...props} /></ErrorBoundary>} />
        <Route exact path="/:locale/user_registrations/:resetPasswordToken/activate" component={props => <ErrorBoundary><ActivateAccount {...props} /></ErrorBoundary>} />
        <Route exact path="/:locale/user_registrations/new" component={props => <ErrorBoundary><RegisterContainer {...props} /></ErrorBoundary>} />
        <Route exact path="/:locale/user_registrations" component={props => <ErrorBoundary><UserRegistrationsContainer {...props} /></ErrorBoundary>} />
    </Switch>
);

export const RoutesWithProjectId = () => (
    <Switch>
        <Route exact path="/:projectId/:locale" component={props => <ErrorBoundary><HomeContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/accounts/current" component={props => <ErrorBoundary><WrappedAccountContainer {...props} /></ErrorBoundary>} />
        <Route exact path="/:projectId/:locale/interviews/new" component={props => <ErrorBoundary><EditInterviewContainer {...props} /></ErrorBoundary>} />
        <Route exact path="/:projectId/:locale/interviews/:archiveId" component={props => <ErrorBoundary><InterviewContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/uploads/new" component={props => <ErrorBoundary><UploadsContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/registry_entries" component={props => <ErrorBoundary><RegistryContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/searches/archive" component={props => <ErrorBoundary><ArchiveSearchContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/searches/map" component={props => <ErrorBoundary><MapSearchContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/projects" component={props => <ErrorBoundary><WrappedProjectsContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/people" component={props => <ErrorBoundary><WrappedPeopleContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/registry_reference_types" component={props => <ErrorBoundary><WrappedRegistryReferenceTypesContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/languages" component={props => <ErrorBoundary><WrappedLanguagesContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/collections" component={props => <ErrorBoundary><WrappedCollectionsContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/roles" component={props => <ErrorBoundary><WrappedRolesContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/permissions" component={props => <ErrorBoundary><WrappedPermissionsContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/task_types" component={props => <ErrorBoundary><WrappedTaskTypesContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/user_accounts/password/new" component={props => <ErrorBoundary><OrderNewPasswordContainer {...props} /></ErrorBoundary>} />
        <Route path="/:projectId/:locale/user_accounts/password/edit" component={props => <ErrorBoundary><ActivateAccount {...props} /></ErrorBoundary>} />
        <Route exact path="/:projectId/:locale/user_registrations/:resetPasswordToken/activate" component={props => <ErrorBoundary><ActivateAccount {...props} /></ErrorBoundary>} />
        <Route exact path="/:projectId/:locale/user_registrations/new" component={props => <ErrorBoundary><RegisterContainer {...props} /></ErrorBoundary>} />
        <Route exact path="/:projectId/:locale/user_registrations" component={props => <ErrorBoundary><UserRegistrationsContainer {...props} /></ErrorBoundary>} />
    </Switch>
);
