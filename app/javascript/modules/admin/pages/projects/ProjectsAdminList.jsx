import { ProjectTile, useProjectList } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Lists editable project summaries; full admin data is fetched when a dialog opens.
 *
 * @returns {React.ReactElement} Project list with creation and editing controls.
 */
export default function ProjectsAdminList() {
    const { t } = useI18n();
    const { projects, isLoading, error } = useProjectList({
        all: true,
        include: ['institutions'],
    });

    // The shared admin controls use type to check permissions; the API omits it.
    const data = projects.map((project) => ({ ...project, type: 'Project' }));

    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    if (error)
        return (
            <p role="alert">
                {t('error')}: {error.message}
            </p>
        );
    if (isLoading) return <Spinner withPadding />;

    return (
        <PaginatedAdminRecordList
            data={data}
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
            // useProjectList handles fetching, so the shared list needs no legacy query.
            query={null}
            scope="project"
            // Contact email is fetched with the full project when opening the edit form.
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
