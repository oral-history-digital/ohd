import { getCurrentProject } from 'modules/data';
import { useSelector } from 'react-redux';

import AffiliateForm from '../../AffiliateForm';
import AffiliateShow from '../../AffiliateShow';
import DataList from '../../DataList';
import { useAdminDataActions } from '../../hooks';

export default function CooperationPartners() {
    const project = useSelector(getCurrentProject);
    const { fetchData, deleteData, submitData } = useAdminDataActions();

    return (
        <DataList
            editView
            data={project.cooperation_partners}
            outerScope="project"
            outerScopeId={project.id}
            scope="cooperation_partner"
            detailsAttributes={['name', 'first_name', 'last_name']}
            initialFormValues={{
                project_id: project.id,
                type: 'CooperationPartner',
            }}
            form={AffiliateForm}
            showComponent={AffiliateShow}
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
