import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { getProjectId } from 'modules/archive';
import { getCurrentProject } from 'modules/data';

import { TableWithPagination, DateCell } from 'modules/tables';
import useUsers from './useUsers';
import UserRowActions from './UserRowActions';
import ProjectShortnamesCell from './ProjectShortnamesCell';
import RolesCell from './RolesCell';
import TasksCell from './TasksCell';

export default function UserTable() {
    const { t, locale } = useI18n();
    const [page, setPage] = useState(1);
    const { data, isLoading } = useUsers(page);
    const projectId = useSelector(getProjectId);
    const project = useSelector(getCurrentProject);


    const getCurrentUserProject = (row, project) => {
        return Object.values(row.user_projects).find(p => p.project_id === project.id)
    };

    const baseColumns = useMemo(() => ([
        {
            id: 'first_name',
            accessorFn: row => row.first_name,
            header: t('activerecord.attributes.user.first_name')
        },
        {
            id: 'last_name',
            accessorFn: row => row.last_name,
            header: t('activerecord.attributes.user.last_name')
        },
        {
            id: 'email',
            accessorFn: row => row.email,
            header: t('activerecord.attributes.user.email'),
        },
    ]), [locale]);

    const ohdColumns = useMemo(() => ([
        {
            id: 'workflow_state',
            accessorFn: row => row.workflow_state,
            header: t('activerecord.attributes.user.workflow_state'),
        },
        {
            accessorKey: 'activated_at',
            header: t('activerecord.attributes.user.activated_at'),
            accessorFn: row => row.activated_at,
        },
        {
            header: t('activerecord.models.project.other'),
            cell: ProjectShortnamesCell,
        },
    ]), [locale, projectId]);

    const projectColumns = useMemo(() => ([
        {
            id: 'workflow_state',
            header: t('activerecord.attributes.default.workflow_state'),
            accessorFn: row => {
                const workflowState = getCurrentUserProject(row, project).workflow_state;
                return t(`user_projects.workflow_states.${workflowState}`);
            },
        },
        {
            accessorKey: 'updated_at',
            header: t('activerecord.attributes.default.updated_at'),
            accessorFn: row => {
                return getCurrentUserProject(row, project).updated_at;
            },
            cell: DateCell,
        },
        {
            header: t('activerecord.models.role.other'),
            cell: RolesCell,
        },
        {
            header: t('activerecord.models.task.other'),
            cell: TasksCell,
        },
    ]), [locale, projectId]);

    const actionColumns = useMemo(() => ([
        {
            id: 'actions',
            header: t('modules.tables.actions'),
            cell: UserRowActions
        }
    ]), [locale, projectId]);

    const columns = baseColumns.concat(projectId !== 'ohd' ? projectColumns : ohdColumns).concat(actionColumns);

    return (
        <TableWithPagination
            data={Object.values(data?.data || {})}
            pageCount={data?.result_pages_count}
            columns={columns}
            isLoading={isLoading}
            setPage={setPage}
            manualPagination
        />
    );
}
