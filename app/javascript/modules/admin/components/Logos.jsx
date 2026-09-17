import { getCurrentProject, getProjectLocales } from 'modules/data';
import { useSelector } from 'react-redux';

import { useAdminDataActions } from '../hooks';
import DataList from './DataList';

export default function Logos() {
    const project = useSelector(getCurrentProject);
    const locales = useSelector(getProjectLocales);
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    return (
        <DataList
            editView
            data={project?.logos}
            outerScope="project"
            outerScopeId={project?.id}
            scope="logo"
            detailsAttributes={['src', 'locale']}
            initialFormValues={{
                ref_id: project?.id,
                ref_type: 'Project',
                type: 'Logo',
            }}
            formElements={[
                {
                    attribute: 'locale',
                    elementType: 'select',
                    values: locales,
                    withEmpty: true,
                },
                {
                    attribute: 'file',
                    elementType: 'fileInput',
                    preview: 'image',
                },
            ]}
            helpTextCode="logo_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
