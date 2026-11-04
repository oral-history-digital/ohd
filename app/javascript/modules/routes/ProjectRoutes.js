import { useEffect, useRef } from 'react';

import {
    CollectionsAdminPage,
    ContributionTypesAdminPage,
    EditInterviewPage,
    EditProjectAccessPage,
    EditProjectConfigPage,
    EditProjectDisplayPage,
    EditProjectInfoPage,
    EventTypesAdminPage,
    InstanceSettingsAdminPage,
    LanguagesAdminPage,
    MetadataFieldsAdminPage,
    PeopleAdminPage,
    PermissionsAdminPage,
    RegistryNameTypesAdminPage,
    RegistryReferenceTypesAdminPage,
    RolesAdminPage,
    StatisticsAdminPage,
    TaskTypesAdminPage,
    TranslationValuesAdminPage,
    UploadsPage,
    UsersAdminPage,
} from 'modules/admin';
import {
    clearViewModes,
    getViewMode,
    setArchiveId,
    setAvailableViewModes,
    setViewMode,
} from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { InterviewContainer } from 'modules/interview';
import { TextPage } from 'modules/layout';
import { ErrorBoundary } from 'modules/react-toolbox';
import { RegistryContainer } from 'modules/registry';
import { SearchPage } from 'modules/search';
import { SearchMap } from 'modules/search-map';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import {
    AccountPage,
    ActivateAccount,
    OrderNewPasswordContainer,
    RegisterPage,
} from 'modules/user';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import useProject from './useProject';

/**
 * Renders project pages and initializes view modes after project settings load.
 * Keeps a valid user-selected mode when details refresh within the same project.
 * @returns {React.ReactElement} Project routes, loading indicator, or request error.
 */
export default function ProjectRoutes() {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({});
    const projectDbId = project?.id;
    const viewModes = project?.view_modes;
    const currentViewMode = useSelector(getViewMode);
    const initializedFor = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!projectDbId || !viewModes) return;
        dispatch(setAvailableViewModes(viewModes));
        if (
            initializedFor.current !== projectDbId ||
            !viewModes.includes(currentViewMode)
        ) {
            dispatch(setViewMode(viewModes[0] || null));
        }
        initializedFor.current = projectDbId;
    }, [dispatch, projectDbId, viewModes, currentViewMode]);

    useEffect(() => {
        if (!projectDbId) return;
        return () => {
            dispatch(clearViewModes());
            dispatch(setArchiveId(null));
        };
    }, [dispatch, projectDbId]);

    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner withPadding />;

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
                    element={<InstanceSettingsAdminPage />}
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
                    element={<ContributionTypesAdminPage />}
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
                <Route path="collections" element={<CollectionsAdminPage />} />
                <Route path="roles" element={<RolesAdminPage />} />
                <Route path="permissions" element={<PermissionsAdminPage />} />
                <Route path="task_types" element={<TaskTypesAdminPage />} />
            </Routes>
        </ErrorBoundary>
    );
}
