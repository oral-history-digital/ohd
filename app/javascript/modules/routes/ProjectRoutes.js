import { useEffect } from 'react';

import {
    EditInterview,
    EditProjectAccessConfig,
    EditProjectConfig,
    EditProjectDisplay,
    EditProjectInfo,
    EventTypesAdminPage,
    MetadataFieldsContainer,
    PeopleAdminPage,
    UploadsPage,
    WrappedCollectionsContainer,
    WrappedContributionTypesContainer,
    WrappedLanguagesContainer,
    WrappedPermissionsContainer,
    WrappedRegistryNameTypesContainer,
    WrappedRegistryReferenceTypesContainer,
    WrappedRolesContainer,
    WrappedTaskTypesContainer,
    WrappedTranslationValuesContainer,
} from 'modules/admin';
import { UsersAdminPage } from 'modules/admin';
import {
    clearViewModes,
    getProjectId,
    setArchiveId,
    setAvailableViewModes,
    setProjectId,
    setViewMode,
} from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { InterviewContainer } from 'modules/interview';
import { TextPage } from 'modules/layout';
import { ErrorBoundary } from 'modules/react-toolbox';
import { RegistryContainer } from 'modules/registry';
import { SearchPage } from 'modules/search';
import { SearchMap } from 'modules/search-map';
import {
    AccountPage,
    ActivateAccount,
    OrderNewPasswordContainer,
} from 'modules/user';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

export default function ProjectRoutes() {
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);
    const dispatch = useDispatch();

    useEffect(() => {
        // Set project-specific redux data here.
        dispatch(setAvailableViewModes(project?.view_modes));
        dispatch(setViewMode(project?.view_modes?.[0] || null));

        return function unsetCurrentProjectData() {
            // Unset project-specific redux data here.
            dispatch(clearViewModes());
            dispatch(setArchiveId(null));
            //dispatch(setProjectId(null));
        };
    }, [projectId, dispatch]);

    return (
        <ErrorBoundary>
            <Routes>
                <Route
                    exact
                    path="interviews/new"
                    element={<EditInterview />}
                />
                <Route
                    path="interviews/:archiveId"
                    element={<InterviewContainer />}
                />
                <Route path="searches/archive" element={<SearchPage />} />
                <Route path="searches/map" element={<SearchMap />} />
                <Route
                    path="registry_entries"
                    element={<RegistryContainer />}
                />
                <Route path="users/current" element={<AccountPage />} />
                <Route
                    path="users/password/new"
                    element={<OrderNewPasswordContainer />}
                />
                <Route
                    path="users/password/edit"
                    element={<ActivateAccount />}
                />
                <Route path="users" element={<UsersAdminPage />} />
                <Route path="uploads/new" element={<UploadsPage />} />
                <Route path="project/edit-info" element={<EditProjectInfo />} />
                <Route
                    path="project/edit-config"
                    element={<EditProjectConfig />}
                />
                <Route
                    path="project/edit-access-config"
                    element={<EditProjectAccessConfig />}
                />
                <Route
                    path="project/edit-display"
                    element={<EditProjectDisplay />}
                />
                <Route
                    path="metadata_fields"
                    element={<MetadataFieldsContainer />}
                />
                <Route path="people" element={<PeopleAdminPage />} />
                <Route path="event_types" element={<EventTypesAdminPage />} />
                <Route
                    path="registry_reference_types"
                    element={<WrappedRegistryReferenceTypesContainer />}
                />
                <Route
                    path="registry_name_types"
                    element={<WrappedRegistryNameTypesContainer />}
                />
                <Route
                    path="contribution_types"
                    element={<WrappedContributionTypesContainer />}
                />
                <Route
                    path="languages"
                    element={<WrappedLanguagesContainer />}
                />
                <Route
                    path="translation_values"
                    element={<WrappedTranslationValuesContainer />}
                />
                <Route
                    path="conditions"
                    element={<TextPage code="conditions" />}
                />
                <Route
                    path="ohd_conditions"
                    element={<TextPage code="ohd_conditions" />}
                />
                <Route
                    path="privacy_protection"
                    element={<TextPage code="privacy_protection" />}
                />
                <Route path="contact" element={<TextPage code="contact" />} />
                <Route
                    path="legal_info"
                    element={<TextPage code="legal_info" />}
                />
                <Route
                    path="collections"
                    element={<WrappedCollectionsContainer />}
                />
                <Route path="roles" element={<WrappedRolesContainer />} />
                <Route
                    path="permissions"
                    element={<WrappedPermissionsContainer />}
                />
                <Route
                    path="task_types"
                    element={<WrappedTaskTypesContainer />}
                />
            </Routes>
        </ErrorBoundary>
    );
}
