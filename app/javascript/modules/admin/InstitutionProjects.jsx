import { getCurrentProject, getInstitutions, getStatuses } from 'modules/data';
import { useSelector } from 'react-redux';

import DataList from './DataList';
import { useAdminDataActions } from './hooks';

export default function InstitutionProjects() {
    const project = useSelector(getCurrentProject);
    const institutions = useSelector(getInstitutions);
    const statuses = useSelector(getStatuses);
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    return (
        <DataList
            editView
            data={project.institution_projects}
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
