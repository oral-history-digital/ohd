import { getInstitutions, getStatuses } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { useSelector } from 'react-redux';

import { DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

/**
 * Edits project-owned institution assignments from the edit profile.
 * @returns {React.ReactElement} Resource list, loading indicator, or request error.
 */
export default function InstitutionProjects() {
    const { t } = useI18n();
    const {
        project,
        error,
        isLoading: projectLoading,
    } = useProject({ profile: 'edit', include: ['institution_projects'] });
    const institutions = useSelector(getInstitutions);
    const statuses = useSelector(getStatuses);
    const { fetchData, deleteData, submitData } = useAdminDataActions();
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
    if (projectLoading || !project) return <Spinner />;

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
            statuses={statuses}
            otherDataToLoad={['institution']}
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
