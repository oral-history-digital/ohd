import { useEffect, useMemo, useState } from 'react';

import {
    Fetch,
    getCurrentProject,
    getProjects,
    getRolesForCurrentProject,
    getRolesForCurrentProjectFetched,
} from 'modules/data';
import { SelectContainer } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { DateCell, TableWithPagination } from 'modules/tables';
import { useSelector } from 'react-redux';

import ArchiveManagementInCell from './ArchiveManagementInCell';
import ProjectAccessGrantedCell from './ProjectAccessGrantedCell';
import RolesCell from './RolesCell';
import TasksCell from './TasksCell';
import UserRowActions from './UserRowActions';
import UserRowInterviewPermissions from './UserRowInterviewPermissions';
import useUsers from './useUsers';

export default function UserTable() {
    const { t, locale } = useI18n();
    const project = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);
    const projectRoles = useSelector(getRolesForCurrentProject);

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');

    const [projectFilter, setProjectFilter] = useState('');
    const handleProjectFilterChange = (name, value) => {
        setProjectFilter(value);
    };

    const [roleFilter, setRoleFilter] = useState('');
    const handleRoleFilterChange = (name, value) => {
        setRoleFilter(value);
    };

    const [localeFilter, setLocaleFilter] = useState('');
    const handleLocaleFilterChange = (name, value) => {
        setLocaleFilter(value);
    };
    const localeFilterValues = ['all'].concat(
        project.is_ohd
            ? ['de', 'en', 'ru', 'es', 'el']
            : project.available_locales
    );

    const [workflowStateFilter, setWorkflowStateFilter] = useState(
        project.is_ohd ? 'afirmed' : 'project_access_requested'
    );
    const handleWorkflowStateFilterChange = (name, value) => {
        setWorkflowStateFilter(value);
    };
    const workflowStateFilterValues = project.is_ohd
        ? ['afirmed', 'blocked', 'all']
        : [
              'project_access_requested',
              'project_access_granted',
              'project_access_rejected',
              'project_access_blocked',
              'project_access_terminated',
              'all',
          ];

    const [sorting, setSorting] = useState([]);

    const { data, isLoading, dataPath } = useUsers(
        page,
        filter,
        workflowStateFilter,
        localeFilter,
        projectFilter,
        roleFilter,
        sorting
    );

    const getDataPath = (row) => dataPath;

    const currentUserProject = (row, project) => {
        return Object.values(row.user_projects).find(
            (p) => p.project_id === project.id
        );
    };

    const baseColumns = useMemo(
        () => [
            {
                id: 'first_name',
                accessorFn: (row) => row.first_name,
                header: t('activerecord.attributes.user.first_name'),
            },
            {
                id: 'last_name',
                accessorFn: (row) => row.last_name,
                header: t('activerecord.attributes.user.last_name'),
            },
            {
                id: 'email',
                accessorFn: (row) => row.email,
                header: t('activerecord.attributes.user.email'),
            },
        ],
        [locale]
    );

    const ohdColumns = useMemo(
        () => [
            {
                id: 'workflow_state',
                accessorFn: (row) =>
                    t(`workflow_states.users.${row.workflow_state}`),
                header: t('activerecord.attributes.user.workflow_state'),
            },
            {
                accessorKey: 'confirmed_at',
                header: t('activerecord.attributes.user.confirmed_at'),
                cell: DateCell,
            },
            {
                header: t('modules.project_access.granted_in'),
                cell: ProjectAccessGrantedCell,
            },
            {
                header: t('modules.project_access.archive_management_in'),
                cell: ArchiveManagementInCell,
            },
        ],
        [locale, project, dataPath]
    );

    const projectColumns = useMemo(
        () => [
            {
                id: 'workflow_state',
                header: t('activerecord.attributes.user.workflow_state'),
                accessorFn: (row) => {
                    const workflowState = currentUserProject(
                        row,
                        project
                    ).workflow_state;
                    return t(
                        `workflow_states.user${project.is_ohd ? '' : '_project'}s.${workflowState}`
                    );
                },
            },
            {
                accessorKey: 'processed_at',
                header: t('activerecord.attributes.default.updated_at'),
                accessorFn: (row) => {
                    return (
                        currentUserProject(row, project).processed_at ||
                        currentUserProject(row, project).created_at
                    );
                },
                cell: DateCell,
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
        ],
        [locale, project, dataPath]
    );

    const actionColumns = useMemo(
        () => [
            {
                id: 'actions',
                enableSorting: false,
                header: t('modules.tables.actions'),
                accessorFn: getDataPath,
                cell: UserRowActions,
            },
            {
                id: 'interviewPermissions',
                enableSorting: false,
                header: t('modules.tables.interviewPermissions'),
                accessorFn: getDataPath,
                cell: UserRowInterviewPermissions,
            },
        ],
        [locale, project, dataPath]
    );

    const columns = baseColumns
        .concat(!project.is_ohd ? projectColumns : ohdColumns)
        .concat(actionColumns);

    return (
        <>
            <h1 className="registry-entries-title">
                {data?.total} {t('activerecord.models.user.other')}
            </h1>
            <TableWithPagination
                data={data?.data || []}
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
                    attribute="workflow_state"
                    optionsScope={`workflow_states.user${project.is_ohd ? '' : '_project'}s`}
                    handleChange={handleWorkflowStateFilterChange}
                    withEmpty={false}
                    keepOrder={true}
                />
                {project.available_locales.length > 1 && (
                    <SelectContainer
                        className="u-mb-small"
                        values={localeFilterValues}
                        label={t('activerecord.attributes.user.default_locale')}
                        attribute="default_locale"
                        optionsScope={'default_locales'}
                        handleChange={handleLocaleFilterChange}
                        withEmpty={false}
                    />
                )}
                {project.is_ohd && (
                    <SelectContainer
                        className="u-mb-small"
                        values={projects}
                        label={t('activerecord.models.project.one')}
                        attribute="project"
                        handleChange={handleProjectFilterChange}
                        withEmpty={true}
                    />
                )}
                {!project.is_ohd && (
                    <Fetch
                        fetchParams={[
                            'roles',
                            null,
                            null,
                            `for_projects=${project?.id}`,
                        ]}
                        testSelector={getRolesForCurrentProjectFetched}
                    >
                        <SelectContainer
                            className="u-mb-small"
                            values={projectRoles}
                            label={t('activerecord.models.role.one')}
                            attribute="role"
                            handleChange={handleRoleFilterChange}
                            withEmpty={true}
                        />
                    </Fetch>
                )}
            </TableWithPagination>
        </>
    );
}
