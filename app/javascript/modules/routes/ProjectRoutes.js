import { useEffect  } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setProjectId, getProjectId, setArchiveId, setAvailableViewModes,
    setViewMode, clearViewModes } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { ErrorBoundary } from 'modules/react-toolbox';
import { HomeContainer } from 'modules/startpage';
import { InterviewContainer } from 'modules/interview';
import { SearchPage } from 'modules/search';
import { SearchMap } from 'modules/search-map';
import { RegistryContainer } from 'modules/registry';
import { WrappedRolesContainer,
    WrappedPermissionsContainer, WrappedTaskTypesContainer, WrappedRegistryReferenceTypesContainer,
    WrappedContributionTypesContainer, WrappedRegistryNameTypesContainer,
    WrappedLanguagesContainer, WrappedCollectionsContainer,
    UploadsContainer, EditProjectDisplay, EditProjectConfig, EditProjectInfo,
    MetadataFieldsContainer, EditInterview, PeopleAdminPage
} from 'modules/admin';
import { AccountPage, OrderNewPasswordContainer, RegisterContainer, ActivateAccount }
    from 'modules/account';
import { UserRegistrationsContainer } from 'modules/users';

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
                <Route exact path="interviews/new" element={<EditInterview />} />
                <Route path="interviews/:archiveId" element={<InterviewContainer />} />
                <Route path="searches/archive" element={<SearchPage />} />
                <Route path="searches/map" element={<SearchMap />} />
                <Route path="registry_entries" element={<RegistryContainer />} />
                <Route path="accounts/current" element={<AccountPage />} />
                <Route path="user_accounts/password/new" element={<OrderNewPasswordContainer />} />
                <Route path="user_accounts/password/edit" element={<ActivateAccount />} />
                <Route path="user_registrations/:resetPasswordToken/activate" element={<ActivateAccount />} />
                <Route path="user_registrations/new" element={<RegisterContainer />} />
                <Route path="user_registrations" element={<UserRegistrationsContainer />} />
                <Route path="uploads/new" element={<UploadsContainer />} />
                <Route path="project/edit-info" element={<EditProjectInfo />} />
                <Route path="project/edit-config" element={<EditProjectConfig />} />
                <Route path="project/edit-display" element={<EditProjectDisplay />} />
                <Route path="metadata_fields" element={<MetadataFieldsContainer />} />
                <Route path="people" element={<PeopleAdminPage />} />
                <Route path="registry_reference_types" element={<WrappedRegistryReferenceTypesContainer />} />
                <Route path="registry_name_types" element={<WrappedRegistryNameTypesContainer />} />
                <Route path="contribution_types" element={<WrappedContributionTypesContainer />} />
                <Route path="languages" element={<WrappedLanguagesContainer />} />
                <Route path="collections" element={<WrappedCollectionsContainer />} />
                <Route path="roles" element={<WrappedRolesContainer />} />
                <Route path="permissions" element={<WrappedPermissionsContainer />} />
                <Route path="task_types" element={<WrappedTaskTypesContainer />} />
                <Route exact path="/" element={<HomeContainer />} />
            </Routes>
        </ErrorBoundary>
    );
}
