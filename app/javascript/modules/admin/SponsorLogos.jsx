import { getCurrentProject, getProjectLocales } from 'modules/data';
import { useSelector } from 'react-redux';

import DataList from './DataList';
import { useAdminDataActions } from './hooks';

export default function SponsorLogos() {
    const project = useSelector(getCurrentProject);
    const locales = useSelector(getProjectLocales);
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    return (
        <DataList
            editView
            data={project.sponsor_logos}
            outerScope="project"
            outerScopeId={project.id}
            scope="sponsor_logo"
            detailsAttributes={['src', 'locale']}
            initialFormValues={{
                ref_id: project.id,
                ref_type: 'Project',
                type: 'SponsorLogo',
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
                { attribute: 'href' },
                { attribute: 'title' },
            ]}
            helpTextCode="sponsor_logo_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
