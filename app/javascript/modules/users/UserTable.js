import { useMemo, useState } from 'react';

import {
    Fetch,
    getCurrentUser,
    getRolesForCurrentProject,
    getRolesForCurrentProjectFetched,
    useProjectList,
} from 'modules/data';
import { SelectField } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { DateCell, TableWithPagination } from 'modules/tables';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import ArchiveManagementInCell from './ArchiveManagementInCell';
import MfaStatusCell from './MfaStatusCell';
import ProjectAccessGrantedCell from './ProjectAccessGrantedCell';
import RolesCell from './RolesCell';
import UserRowActions from './UserRowActions';
import UserRowInterviewPermissions from './UserRowInterviewPermissions';
import useUsers from './useUsers';

/**
 * Loads project settings before initializing account and project-access filters.
 *
 * @returns {React.ReactElement} User table, loading indicator, or request error.
 */
export default function UserTable() {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject();
    if (error)
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    if (isLoading || !project) return <Spinner />;

    // Initialize filters after project settings load, and reset them when changing projects.
    return <ProjectUserTable key={project.id} project={project} />;
}

/**
 * Keeps user filters and pagination for a loaded project.
 * @param {Object} props - Current project display settings.
 * @returns {React.ReactElement} User table and filter controls.
 */
function ProjectUserTable({ project }) {
    const { t } = useI18n();
    const currentUser = useSelector(getCurrentUser);
    const { projects } = useProjectList({ all: true });
    const projectRoles = useSelector(getRolesForCurrentProject);

    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('');

    const [projectFilter, setProjectFilter] = useState('');
    const handleProjectFilterChange = (_, value) => {
        setProjectFilter(value);
    };

    const [roleFilter, setRoleFilter] = useState('');
    const handleRoleFilterChange = (_, value) => {
        setRoleFilter(value);
    };

    const [mfaFilter, setMfaFilter] = useState('');
    const handleMfaFilterChange = (_, value) => {
        setMfaFilter(value);
    };

    const [projectManagerFilter, setProjectManagerFilter] = useState('');
    const handleProjectManagerFilterChange = (_, value) => {
        setProjectManagerFilter(value);
    };

    const [superuserFilter, setSuperuserFilter] = useState('');
    const handleSuperuserFilterChange = (_, value) => {
        setSuperuserFilter(value);
    };

    const [localeFilter, setLocaleFilter] = useState('');
    const handleLocaleFilterChange = (_, value) => {
        setLocaleFilter(value);
    };
    const localeFilterValues = ['all'].concat(
        project.is_umbrella
            ? ['de', 'en', 'ru', 'es', 'el']
            : project.available_locales
    );

    const [workflowStateFilter, setWorkflowStateFilter] = useState(
        project.is_umbrella ? 'afirmed' : 'project_access_requested'
    );
    const handleWorkflowStateFilterChange = (_, value) => {
        setWorkflowStateFilter(value);
    };
    const workflowStateFilterValues = project.is_umbrella
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
        mfaFilter,
        projectManagerFilter,
        superuserFilter,
        sorting
    );

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
            {
                id: 'mfa',
                enableSorting: false,
                header: 'MFA',
                cell: MfaStatusCell,
            },
        ],
        [t]
    );

    const umbrellaColumns = useMemo(
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
        [t]
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
                        `workflow_states.user${project.is_umbrella ? '' : '_project'}s.${workflowState}`
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
                accessorFn: () => dataPath,
                cell: RolesCell,
            },
            //{
            //header: t('activerecord.models.task.other'),
            //cell: TasksCell,
            //},
        ],
        [t, project, dataPath]
    );

    const actionColumns = useMemo(() => {
        const columns = [
            {
                id: 'actions',
                enableSorting: false,
                header: t('modules.tables.actions'),
                accessorFn: () => dataPath,
                cell: UserRowActions,
            },
        ];

        if (!project.is_umbrella) {
            columns.push({
                id: 'interviewPermissions',
                enableSorting: false,
                header: t('modules.tables.interviewPermissions'),
                accessorFn: () => dataPath,
                cell: UserRowInterviewPermissions,
            });
        }

        return columns;
    }, [t, project, dataPath]);

    const columns = baseColumns
        .concat(!project.is_umbrella ? projectColumns : umbrellaColumns)
        .concat(actionColumns);

    return (
        <>
            <h1 className="Page-main-title">
                {data?.total} {t('activerecord.models.user.other')}
            </h1>
            <TableWithPagination
                className="UserTable"
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
                <div className="UserTable-filters">
                    <SelectField
                        className="UserTable-filter"
                        values={workflowStateFilterValues}
                        label={t('activerecord.attributes.user.workflow_state')}
                        attribute="workflow_state"
                        optionsScope={`workflow_states.user${project.is_umbrella ? '' : '_project'}s`}
                        handleChange={handleWorkflowStateFilterChange}
                        withEmpty={false}
                        keepOrder={true}
                    />
                    {project.available_locales.length > 1 && (
                        <SelectField
                            className="UserTable-filter"
                            values={localeFilterValues}
                            label={t(
                                'activerecord.attributes.user.default_locale'
                            )}
                            attribute="default_locale"
                            optionsScope={'default_locales'}
                            handleChange={handleLocaleFilterChange}
                            withEmpty={false}
                        />
                    )}
                    <SelectField
                        className="UserTable-filter"
                        values={[
                            { id: 'enabled', name: t('enabled') },
                            { id: 'disabled', name: t('disabled') },
                        ]}
                        label="MFA"
                        attribute="mfa"
                        handleChange={handleMfaFilterChange}
                        withEmpty={true}
                        keepOrder={true}
                    />
                    {project.is_umbrella && (
                        <>
                            <SelectField
                                className="UserTable-filter"
                                values={[
                                    {
                                        id: 'yes',
                                        name: t('boolean_value.true'),
                                    },
                                    {
                                        id: 'no',
                                        name: t('boolean_value.false'),
                                    },
                                ]}
                                label={t(
                                    'modules.project_access.archive_management_in'
                                )}
                                attribute="project_manager"
                                handleChange={handleProjectManagerFilterChange}
                                withEmpty={true}
                                keepOrder={true}
                            />

                            <SelectField
                                className="UserTable-filter UserTable-filter--wide"
                                values={projects}
                                label={t('activerecord.models.project.one')}
                                attribute="project"
                                handleChange={handleProjectFilterChange}
                                withEmpty={true}
                            />
                        </>
                    )}
                    {!project.is_umbrella && (
                        <Fetch
                            fetchParams={[
                                'roles',
                                null,
                                null,
                                `for_projects=${project?.id}`,
                            ]}
                            testSelector={getRolesForCurrentProjectFetched}
                        >
                            <SelectField
                                className="UserTable-filter UserTable-filter--wide"
                                values={projectRoles}
                                label={t('activerecord.models.role.one')}
                                attribute="role"
                                handleChange={handleRoleFilterChange}
                                withEmpty={true}
                            />
                        </Fetch>
                    )}
                    {currentUser?.admin && (
                        <SelectField
                            className="UserTable-filter"
                            values={[
                                { id: 'yes', name: t('boolean_value.true') },
                                { id: 'no', name: t('boolean_value.false') },
                            ]}
                            label={t('user.superuser')}
                            attribute="superuser"
                            handleChange={handleSuperuserFilterChange}
                            withEmpty={true}
                            keepOrder={true}
                        />
                    )}
                </div>
            </TableWithPagination>
        </>
    );
}

ProjectUserTable.propTypes = {
    project: PropTypes.shape({
        id: PropTypes.number.isRequired,
        is_umbrella: PropTypes.bool.isRequired,
        available_locales: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};
