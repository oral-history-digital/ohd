import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { getProjectId } from 'modules/archive';
import { getCurrentProject } from 'modules/data';

import { TableWithPagination, DateCell } from 'modules/tables';
import useUsers from './useUsers';
import UserRowActions from './UserRowActions';
import ProjectShortnamesCell from './ProjectShortnamesCell';
import RolesCell from './RolesCell';

export default function UserTable() {
    const { t, locale } = useI18n();
    const { data, isLoading } = useUsers();
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);

    const getCurrentUserRegistrationProject = (row, project) => {
        return Object.values(row.user_registration_projects).find(p => p.project_id === project.id)
    };

    const baseColumns = useMemo(() => ([
        {
            id: 'first_name',
            accessorFn: row => row.first_name,
            header: t('activerecord.attributes.user_registration.first_name')
        },
        {
            id: 'last_name',
            accessorFn: row => row.last_name,
            header: t('activerecord.attributes.user_registration.last_name')
        },
        {
            id: 'email',
            accessorFn: row => row.email,
            header: t('activerecord.attributes.user_registration.email'),
        },
    ]), [locale]);

    const ohdColumns = useMemo(() => ([
        {
            accessorKey: 'activated_at',
            header: t('activerecord.attributes.user_registration.activated_at'),
            accessorFn: row => row.activated_at,
        },
        {
            header: t('activerecord.models.project.other'),
            cell: ProjectShortnamesCell,
        },
    ]), [locale]);

    const projectColumns = useMemo(() => ([
        {
            id: 'workflow_state',
            header: t('activerecord.attributes.default.workflow_state'),
            accessorFn: row => {
                const workflowState = getCurrentUserRegistrationProject(row, project).workflow_state;
                return t(`user_registration_projects.workflow_states.${workflowState}`);
            },
        },
        {
            accessorKey: 'updated_at',
            header: t('activerecord.attributes.default.updated_at'),
            accessorFn: row => {
                return getCurrentUserRegistrationProject(row, project).updated_at;
            },
            cell: DateCell,
        },
        {
            header: t('activerecord.models.role.other'),
            cell: RolesCell,
        },
    ]), [locale]);

    const actionColumns = useMemo(() => ([
        {
            id: 'actions',
            header: t('modules.tables.actions'),
            cell: UserRowActions
        }
    ]), [locale]);

    const columns = baseColumns.concat(projectId !== 'ohd' ? projectColumns : ohdColumns).concat(actionColumns);

    return (
        <TableWithPagination
            data={Object.values(data || {})}
            columns={columns}
            isLoading={isLoading}
        />
    );
}
