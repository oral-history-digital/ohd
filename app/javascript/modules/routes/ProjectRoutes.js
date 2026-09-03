import { useEffect } from 'react';

import {
    EditInterviewPage,
    EditProjectAccessPage,
    EditProjectConfigPage,
    EditProjectDisplayPage,
    EditProjectInfoPage,
    EventTypesAdminPage,
    InstanceSettingAdminPage,
    LanguagesAdminPage,
    MetadataFieldsAdminPage,
    PeopleAdminPage,
    PermissionsAdminPage,
    RegistryNameTypesAdminPage,
    RegistryReferenceTypesAdminPage,
    StatisticsAdminPage,
    TranslationValuesAdminPage,
    UploadsPage,
    UsersAdminPage,
    WrappedCollectionsContainer,
    WrappedContributionTypesContainer,
    WrappedRolesContainer,
    WrappedTaskTypesContainer,
} from 'modules/admin';
import {
    clearViewModes,
    getProjectId,
    setArchiveId,
    setAvailableViewModes,
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
    RegisterPage,
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
                    element={<EditInterviewPage />}
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
                <Route path="register" element={<RegisterPage />} />
                <Route
                    path="admin/instance"
                    element={<InstanceSettingAdminPage />}
                />
                <Route path="users" element={<UsersAdminPage />} />
                <Route
                    path="admin/statistics"
                    element={<StatisticsAdminPage />}
                />
                <Route path="uploads/new" element={<UploadsPage />} />
                <Route
                    path="project/edit-info"
                    element={<EditProjectInfoPage />}
                />
                <Route
                    path="project/edit-config"
                    element={<EditProjectConfigPage />}
                />
                <Route
                    path="project/edit-access-config"
                    element={<EditProjectAccessPage />}
                />
                <Route
                    path="project/edit-display"
                    element={<EditProjectDisplayPage />}
                />
                <Route
                    path="metadata_fields"
                    element={<MetadataFieldsAdminPage />}
                />
                <Route path="people" element={<PeopleAdminPage />} />
                <Route path="event_types" element={<EventTypesAdminPage />} />
                <Route
                    path="registry_reference_types"
                    element={<RegistryReferenceTypesAdminPage />}
                />
                <Route
                    path="registry_name_types"
                    element={<RegistryNameTypesAdminPage />}
                />
                <Route
                    path="contribution_types"
                    element={<WrappedContributionTypesContainer />}
                />
                <Route path="languages" element={<LanguagesAdminPage />} />
                <Route
                    path="translation_values"
                    element={<TranslationValuesAdminPage />}
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
                <Route path="permissions" element={<PermissionsAdminPage />} />
                <Route
                    path="task_types"
                    element={<WrappedTaskTypesContainer />}
                />
            </Routes>
        </ErrorBoundary>
    );
}
