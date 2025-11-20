import {
    CollectionsSearchFormContainer,
    LanguagesSearchFormContainer,
    RegistryNameTypesSearchFormContainer,
    ContributionTypesSearchFormContainer,
    RegistryReferenceTypesSearchFormContainer,
} from 'modules/admin';
import { ErrorBoundary } from 'modules/react-toolbox';
import { usePathBase, useProject } from 'modules/routes';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import AdminSubTab from './AdminSubTab';

export default function IndexingTabPanel() {
    const { t } = useI18n();
    const { project } = useProject();
    const { isAuthorized } = useAuthorization();
    const pathBase = usePathBase();

    function isRegularArchive() {
        return !project.is_ohd;
    }

    if (!isAuthorized({ type: 'General' }, 'edit')) {
        return null;
    }

    return (
        <ErrorBoundary small>
            <h3 className="SidebarTabs-title">{t('edit.indexing')}</h3>
            <div className="flyout-sub-tabs-container flyout-video">
                {isRegularArchive() && (
                    <AdminSubTab
                        title="edit.interview.new"
                        url={`${pathBase}/interviews/new`}
                        obj={{ type: 'Interview' }}
                        action="create"
                    />
                )}
                <AdminSubTab
                    title="edit.upload.upload"
                    url={`${pathBase}/uploads/new`}
                    obj={{ type: 'Upload' }}
                    action="create"
                />
                {isRegularArchive() && (
                    <AdminSubTab
                        title="edit.person.admin"
                        url={`${pathBase}/people`}
                        obj={{ type: 'Person' }}
                        action="update"
                    />
                )}
                <AdminSubTab
                    title="edit.registry_reference_type.admin"
                    url={`${pathBase}/registry_reference_types`}
                    obj={{ type: 'RegistryReferenceType' }}
                    action="update"
                >
                    <RegistryReferenceTypesSearchFormContainer />
                </AdminSubTab>
                {isRegularArchive() && (
                    <AdminSubTab
                        title="edit.registry_name_type.admin"
                        url={`${pathBase}/registry_name_types`}
                        obj={{ type: 'RegistryNameType' }}
                        action="update"
                    >
                        <RegistryNameTypesSearchFormContainer />
                    </AdminSubTab>
                )}
                {isRegularArchive() && (
                    <AdminSubTab
                        title="edit.contribution_type.admin"
                        url={`${pathBase}/contribution_types`}
                        obj={{ type: 'ContributionType' }}
                        action="update"
                    >
                        <ContributionTypesSearchFormContainer />
                    </AdminSubTab>
                )}
                {isRegularArchive() && (
                    <AdminSubTab
                        title="edit.collection.admin"
                        url={`${pathBase}/collections`}
                        obj={{ type: 'Collection' }}
                        action="update"
                    >
                        <CollectionsSearchFormContainer />
                    </AdminSubTab>
                )}
                {isRegularArchive() && (
                    <AdminSubTab
                        title="edit.language.admin"
                        url={`${pathBase}/languages`}
                        obj={{ type: 'Language' }}
                        action="update"
                    >
                        <LanguagesSearchFormContainer />
                    </AdminSubTab>
                )}
            </div>
        </ErrorBoundary>
    );
}
