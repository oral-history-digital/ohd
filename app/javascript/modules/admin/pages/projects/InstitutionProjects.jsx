import { getStatuses, useGetInstitutions } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { useSelector } from 'react-redux';

import { DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Edits project institution assignments after their separate institution names load.
 * @returns {React.ReactElement} Resource list, loading indicator, or request error.
 */
export default function InstitutionProjects() {
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject({ profile: 'edit', include: ['institution_projects'] });
    const institutions = useGetInstitutions({ enabled: !!project && !error });
    const statuses = useSelector(getStatuses);
    const institutionStatus = statuses?.institutions?.all;
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    if (error || /^error/.test(institutionStatus)) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={
                    error?.message || t('explorer.institutions_list.error')
                }
                isClosable={false}
            />
        );
    }
    if (projectLoading || !project || !/^fetched/.test(institutionStatus))
        return <Spinner />;

    // Assignment records contain IDs; institution names belong to the institution reader.
    const assignments = project.institution_projects.map((assignment) => ({
        ...assignment,
        name: institutions?.[assignment.institution_id]?.name,
        shortname: institutions?.[assignment.institution_id]?.shortname,
    }));
    return (
        <DataList
            editView
            data={assignments}
            outerScope="project"
            outerScopeId={project.id}
            scope="institution_project"
            detailsAttributes={['name', 'shortname']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                {
                    attribute: 'institution_id',
                    elementType: 'select',
                    values: institutions,
                    withEmpty: true,
                },
                {
                    attribute: 'primary',
                    elementType: 'input',
                    type: 'checkbox',
                },
            ]}
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
