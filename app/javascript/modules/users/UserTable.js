import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { useI18n } from 'modules/i18n';
import { getCurrentProject, getProjects } from 'modules/data';

import { TableWithPagination, DateCell } from 'modules/tables';
import useUsers from './useUsers';
import UserRowActions from './UserRowActions';
import ProjectShortnamesCell from './ProjectShortnamesCell';
import RolesCell from './RolesCell';
import TasksCell from './TasksCell';
import { SelectContainer } from 'modules/forms';

export default function UserTable() {
    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');

    const [projectFilter, setProjectFilter] = useState('');
    const handleProjectFilterChange = (name, value) => {
        setProjectFilter(value);
    };

    const [localeFilter, setLocaleFilter] = useState('');
    const handleLocaleFilterChange = (name, value) => {
        setLocaleFilter(value);
    };
    const localeFilterValues = ['all'].concat(project.is_ohd ? [
        'de',
        'en',
    ] : project.available_locales);

    const [workflowStateFilter, setWorkflowStateFilter] = useState(project.is_ohd ? 'confirmed' : 'project_access_requested');
    const handleWorkflowStateFilterChange = (name, value) => {
        setWorkflowStateFilter(value);
    };
    const workflowStateFilterValues = project.is_ohd ? [
        'confirmed',
        'blocked',
        'all',
    ] : [
        'project_access_requested',
        'project_access_granted',
        'project_access_rejected',
        'project_access_blocked',
        'project_access_terminated',
        'all',
    ];

    const [sorting, setSorting] = useState([]);

    const { data, isLoading, dataPath } = useUsers(page, filter, workflowStateFilter, localeFilter, projectFilter, sorting);

    const getDataPath = (row) => dataPath;

    const usersCount = typeof data?.data === 'undefined' ?
        undefined :
        Object.values(data?.data).length;

    const currentUserProject = (row, project) => {
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
            accessorFn: row => t(`workflow_states.users.${row.workflow_state}`),
            header: t('activerecord.attributes.user.workflow_state'),
        },
        {
            accessorKey: 'confirmed_at',
            header: t('activerecord.attributes.user.confirmed_at'),
            accessorFn: row => new Date(row.confirmed_at).toLocaleDateString(locale, { dateStyle: 'medium' }),
            enableSorting: false,
        },
        {
            header: t('activerecord.models.project.other'),
            cell: ProjectShortnamesCell,
        },
    ]), [locale, project]);

    const projectColumns = useMemo(() => ([
        {
            id: 'workflow_state',
            enableSorting: false,
            header: t('activerecord.attributes.default.workflow_state'),
            accessorFn: row => {
                const workflowState = currentUserProject(row, project).workflow_state;
                return t(`workflow_states.user${project.is_ohd ? '' : '_project'}s.${workflowState}`,);
            },
        },
        {
            accessorKey: 'updated_at',
            header: t('activerecord.attributes.default.updated_at'),
            accessorFn: row => {
                return currentUserProject(row, project).updated_at;
            },
            cell: DateCell,
            enableSorting: false,
        },
        {
            header: t('activerecord.models.role.other'),
            accessorFn: getDataPath,
            cell: RolesCell,
        },
        //{
            //header: t('activerecord.models.task.other'),
            //cell: TasksCell,
        //},
    ]), [locale, project]);

    const actionColumns = useMemo(() => ([
        {
            id: 'actions',
            enableSorting: false,
            header: t('modules.tables.actions'),
            accessorFn: getDataPath,
            cell: UserRowActions,
        }
    ]), [locale, project, dataPath]);

    const columns = baseColumns.concat(!project.is_ohd ? projectColumns : ohdColumns).concat(actionColumns);

    return (
        <>
            <h1 className="registry-entries-title">
                {usersCount} {t('activerecord.models.user.other')}
            </h1>
            <TableWithPagination
                data={Object.values(data?.data || {})}
                pageCount={data?.result_pages_count}
                columns={columns}
                isLoading={isLoading}
                setPage={setPage}
                manualPagination
                manualFiltering
                manualFilterFunc={setFilter}
                manualFilter={filter}
                manualSorting
                manualSortFunc={setSorting}
                manualSort={sorting}
                changePageSize={false}
            >
                <SelectContainer
                    className="u-mb-small"
                    values={workflowStateFilterValues}
                    label={t('activerecord.attributes.user.workflow_state')}
                    attribute='workflow_state'
                    optionsScope={`workflow_states.user${project.is_ohd ? '' : '_project'}s`}
                    handleChange={handleWorkflowStateFilterChange}
                    withEmpty={false}
                />
                <SelectContainer
                    className="u-mb-small"
                    values={localeFilterValues}
                    label={t('activerecord.attributes.user.default_locale')}
                    attribute='default_locale'
                    optionsScope={'default_locales'}
                    handleChange={handleLocaleFilterChange}
                    withEmpty={false}
                />
                { project.is_ohd && <SelectContainer
                    className="u-mb-small"
                    values={projects}
                    label={t('activerecord.models.project.one')}
                    attribute='project'
                    handleChange={handleProjectFilterChange}
                    withEmpty={true}
                /> }
            </TableWithPagination>
        </>
    );
}
