import { useCallback } from 'react';

import { fetchData, getProjects, submitData } from 'modules/data';
import { ProjectTile, getProjectsStatus, getStatuses } from 'modules/data';
import { setQueryParams } from 'modules/search';
import { useDispatch, useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';

export default function ProjectsAdminList() {
    const dispatch = useDispatch();
    const projectsById = useSelector(getProjects);
    const dataStatus = useSelector(getProjectsStatus);
    const statuses = useSelector(getStatuses);

    // Filter out non-project entries and ensure we have an array of project objects.
    const projects = Object.values(projectsById || {}).filter(
        (project) =>
            project &&
            typeof project === 'object' &&
            !Array.isArray(project) &&
            project.id !== undefined &&
            project.id !== null &&
            !project.is_ohd
    );

    const fetchAdminData = useCallback(
        (...args) => dispatch(fetchData(...args)),
        [dispatch]
    );
    const submitAdminData = useCallback(
        (...args) => dispatch(submitData(...args)),
        [dispatch]
    );
    const updateQueryParams = useCallback(
        (...args) => dispatch(setQueryParams(...args)),
        [dispatch]
    );

    return (
        <PaginatedAdminRecordList
            data={projects}
            dataStatus={dataStatus}
            statuses={statuses}
            otherDataToLoad={['institution', 'collection']}
            resultPagesCount={dataStatus.resultPagesCount}
            fetchData={fetchAdminData}
            submitData={submitAdminData}
            setQueryParams={updateQueryParams}
            // Projects are hydrated via the SWR list in ProjectsAdminPage bridge.
            // Keep query null so PaginatedAdminRecordList does not trigger legacy
            // paginated /projects fetch that can replace Redux projects state.
            query={null}
            scope="project"
            // Keep archive list lightweight. Contact email is loaded as part of
            // single-project full payload when opening the edit form.
            sensitiveAttributes={[]}
            detailsAttributes={['title', 'workflow_state', 'doi_status']}
            initialFormValues={{
                display_ohd_link: true,
                pseudo_view_modes: 'grid,list,workflow',
            }}
            formElements={[
                {
                    attribute: 'name',
                    multiLocale: true,
                },
                {
                    attribute: 'shortname',
                    validate: function (v) {
                        return /^[-a-z0-9]{1,11}[a-z]$/.test(v);
                    },
                },
                {
                    attribute: 'publication_date',
                    validate: function (v) {
                        return /^\d{4}$/.test(v);
                    },
                    help: 'YYYY',
                },
                {
                    attribute: 'default_locale',
                    validate: function (v) {
                        return /^[a-z]{2}$/.test(v);
                    },
                },
                {
                    attribute: 'pseudo_available_locales',
                    validate: function (v) {
                        return /^([a-z]{2},?)+$/.test(v);
                    },
                },
                {
                    elementType: 'input',
                    attribute: 'contact_email',
                    type: 'email',
                    validate: function (v) {
                        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([-a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                            v
                        );
                    },
                },
                {
                    attribute: 'archive_domain',
                    help: 'activerecord.attributes.project.archive_domain_help',
                },
                {
                    elementType: 'select',
                    attribute: 'workflow_state',
                    values: ['public', 'unshared'],
                    optionsScope: 'workflow_states',
                },
            ]}
            hideRegisterDoiAction={false}
            showComponent={ProjectTile}
            helpTextCode="archive_form"
        />
    );
}
