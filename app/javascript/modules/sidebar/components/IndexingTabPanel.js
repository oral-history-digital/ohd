import {
    CollectionsSearchForm,
    ContributionTypesSearchForm,
    LanguagesSearchForm,
    RegistryNameTypesSearchForm,
    RegistryReferenceTypesSearchForm,
} from 'modules/admin';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { usePathBase, useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';

import AdminSubTab from './AdminSubTab';

/**
 * Shows authorized indexing controls for the current project.
 *
 * @returns {React.ReactElement|null} Controls, request status, or nothing without permission.
 */
export default function IndexingTabPanel() {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({});
    const { isAuthorized } = useAuthorization();
    const pathBase = usePathBase();

    if (!isAuthorized({ type: 'General' }, 'edit')) {
        return null;
    }

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;

    return (
        <ErrorBoundary small>
            <h3 className="SidebarTabs-title">{t('edit.indexing')}</h3>
            <div className="flyout-sub-tabs-container flyout-video">
                {!project.is_umbrella && (
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
                {!project.is_umbrella && (
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
                    <RegistryReferenceTypesSearchForm />
                </AdminSubTab>
                {!project.is_umbrella && (
                    <>
                        <AdminSubTab
                            title="edit.registry_name_type.admin"
                            url={`${pathBase}/registry_name_types`}
                            obj={{ type: 'RegistryNameType' }}
                            action="update"
                        >
                            <RegistryNameTypesSearchForm />
                        </AdminSubTab>
                        <AdminSubTab
                            title="edit.contribution_type.admin"
                            url={`${pathBase}/contribution_types`}
                            obj={{ type: 'ContributionType' }}
                            action="update"
                        >
                            <ContributionTypesSearchForm />
                        </AdminSubTab>
                        <AdminSubTab
                            title="edit.collection.admin"
                            url={`${pathBase}/collections`}
                            obj={{ type: 'Collection' }}
                            action="update"
                        >
                            <CollectionsSearchForm />
                        </AdminSubTab>
                        <AdminSubTab
                            title="edit.language.admin"
                            url={`${pathBase}/languages`}
                            obj={{ type: 'Language' }}
                            action="update"
                        >
                            <LanguagesSearchForm />
                        </AdminSubTab>
                    </>
                )}
            </div>
        </ErrorBoundary>
    );
}
