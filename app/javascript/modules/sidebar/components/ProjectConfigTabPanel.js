import {
    PermissionSearchFormContainer,
    RoleSearchFormContainer,
    TaskTypeSearchFormContainer,
    TranslationValuesSearchFormContainer,
} from 'modules/admin';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { usePathBase } from 'modules/routes';

import AdminSubTab from './AdminSubTab';
import ToggleTranslationsView from './ToggleTranslationsView';

export default function ProjectConfigTabPanel() {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();
    const pathBase = usePathBase();

    if (!isAuthorized({ type: 'General' }, 'edit')) {
        return null;
    }

    return (
        <ErrorBoundary small>
            <h3 className="SidebarTabs-title">{t('edit.project.admin')}</h3>
            <div className="flyout-sub-tabs-container flyout-video">
                <AdminSubTab
                    title="edit.project.info"
                    url={`${pathBase}/project/edit-info`}
                    obj={{ type: 'Project' }}
                    action="update"
                />
                <AdminSubTab
                    title="edit.project.config"
                    url={`${pathBase}/project/edit-config`}
                    obj={{ type: 'Project' }}
                    action="update"
                />
                <AdminSubTab
                    title="edit.project.access_config"
                    url={`${pathBase}/project/edit-access-config`}
                    obj={{ type: 'Project' }}
                    action="update"
                />
                <AdminSubTab
                    title="edit.project.display"
                    url={`${pathBase}/project/edit-display`}
                    obj={{ type: 'Project' }}
                    action="update"
                />
                <AdminSubTab
                    title="edit.metadata_field.admin"
                    url={`${pathBase}/metadata_fields`}
                    obj={{ type: 'Project' }}
                    action="update"
                />
                <AdminSubTab
                    title="edit.role.admin"
                    url={`${pathBase}/roles`}
                    obj={{ type: 'Role' }}
                    action="update"
                >
                    <RoleSearchFormContainer />
                </AdminSubTab>
                <AdminSubTab
                    title="edit.permission.admin"
                    url={`${pathBase}/permissions`}
                    obj={{ type: 'Permission' }}
                    action="update"
                >
                    <PermissionSearchFormContainer />
                </AdminSubTab>
                <AdminSubTab
                    title="edit.translation_value.admin"
                    url={`${pathBase}/translation_values`}
                    obj={{ type: 'TranslationValue' }}
                    action="update"
                >
                    <ToggleTranslationsView />
                    <TranslationValuesSearchFormContainer />
                </AdminSubTab>
                <AdminSubTab
                    title="edit.task_type.admin"
                    url={`${pathBase}/task_types`}
                    obj={{ type: 'TaskType' }}
                    action="update"
                >
                    <TaskTypeSearchFormContainer />
                </AdminSubTab>
                <AdminSubTab
                    title="edit.event_type.admin"
                    url={`${pathBase}/event_types`}
                    obj={{ type: 'EventType' }}
                    action="update"
                />
            </div>
        </ErrorBoundary>
    );
}
