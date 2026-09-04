import { getCurrentProject } from 'modules/data';
import { useSelector } from 'react-redux';

import DataList from './DataList';
import { useAdminDataActions } from './hooks';

export default function ExternalLinks() {
    const project = useSelector(getCurrentProject);
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    return (
        <DataList
            editView
            data={project.external_links}
            outerScope="project"
            outerScopeId={project.id}
            scope="external_link"
            detailsAttributes={['name', 'url']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                { attribute: 'internal_name' },
                { attribute: 'name', multiLocale: true },
                { attribute: 'url', multiLocale: true },
            ]}
            helpTextCode="external_link_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
