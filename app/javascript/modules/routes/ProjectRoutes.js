import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { ErrorBoundary } from 'modules/react-toolbox';
import { HomeContainer } from 'modules/startpage';
import { InterviewContainer } from 'modules/interview';
import { ArchiveSearchContainer } from 'modules/search';
import { SearchMap } from 'modules/search-map';
import { RegistryContainer } from 'modules/registry';
import { EditInterviewContainer } from 'modules/admin';
import { WrappedRolesContainer,
    WrappedPermissionsContainer, WrappedTaskTypesContainer, WrappedRegistryReferenceTypesContainer,
    WrappedContributionTypesContainer, WrappedRegistryNameTypesContainer,
    WrappedPeopleContainer, WrappedLanguagesContainer, WrappedCollectionsContainer,
    UploadsContainer, EditProjectDisplay, EditProjectConfig, EditProjectInfo,
    MetadataFieldsContainer
} from 'modules/admin';
import { WrappedAccountContainer, OrderNewPasswordContainer, RegisterContainer, ActivateAccount }
    from 'modules/account';
import { UserRegistrationsContainer } from 'modules/users';

export default function ProjectRoutes() {
    let { path } = useRouteMatch();

    return (
        <ErrorBoundary>
            <Switch>
                <Route exact path={`${path}/interviews/new`}>
                    <EditInterviewContainer />
                </Route>
                <Route path={`${path}/interviews/:archiveId`}>
                    <InterviewContainer />
                </Route>
                <Route path={`${path}/searches/archive`}>
                    <ArchiveSearchContainer />
                </Route>
                <Route path={`${path}/searches/map`}>
                    <SearchMap />
                </Route>
                <Route path={`${path}/registry_entries`}>
                    <RegistryContainer />
                </Route>

                <Route path={`${path}/accounts/current`}>
                    <WrappedAccountContainer />
                </Route>
                <Route path={`${path}/user_accounts/password/new`}>
                    <OrderNewPasswordContainer />
                </Route>
                <Route path={`${path}/user_accounts/password/edit`}>
                    <ActivateAccount />
                </Route>
                <Route path={`${path}/user_registrations/:resetPasswordToken/activate`}>
                    <ActivateAccount />
                </Route>
                <Route path={`${path}/user_registrations/new`}>
                    <RegisterContainer />
                </Route>
                <Route path={`${path}/user_registrations`}>
                    <UserRegistrationsContainer />
                </Route>

                <Route path={`${path}/uploads/new`}>
                    <UploadsContainer />
                </Route>
                <Route path={`${path}/project/edit-info`}>
                    <EditProjectInfo />
                </Route>
                <Route path={`${path}/project/edit-config`}>
                    <EditProjectConfig />
                </Route>
                <Route path={`${path}/project/edit-display`}>
                    <EditProjectDisplay />
                </Route>
                <Route path={`${path}/metadata_fields`}>
                    <MetadataFieldsContainer />
                </Route>
                <Route path={`${path}/people`}>
                    <WrappedPeopleContainer />
                </Route>
                <Route path={`${path}/registry_reference_types`}>
                    <WrappedRegistryReferenceTypesContainer />
                </Route>
                <Route path={`${path}/registry_name_types`}>
                    <WrappedRegistryNameTypesContainer />
                </Route>
                <Route path={`${path}/contribution_types`}>
                    <WrappedContributionTypesContainer />
                </Route>
                <Route path={`${path}/languages`}>
                    <WrappedLanguagesContainer />
                </Route>
                <Route path={`${path}/collections`}>
                    <WrappedCollectionsContainer />
                </Route>
                <Route path={`${path}/roles`}>
                    <WrappedRolesContainer />
                </Route>
                <Route path={`${path}/permissions`}>
                    <WrappedPermissionsContainer />
                </Route>
                <Route path={`${path}/task_types`}>
                    <WrappedTaskTypesContainer />
                </Route>

                <Route exact path={path}>
                    <HomeContainer />
                </Route>
            </Switch>
        </ErrorBoundary>
    );
}
