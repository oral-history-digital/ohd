import { getCurrentProject } from 'modules/data';
import { useSelector } from 'react-redux';

import { AffiliateForm, AffiliateShow, DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function Leaders() {
    const project = useSelector(getCurrentProject);
    const { fetchData, deleteData, submitData } = useAdminDataActions();
    return (
        <DataList
            editView
            data={project.leaders}
            outerScope="project"
            outerScopeId={project.id}
            scope="leader"
            detailsAttributes={['name', 'first_name', 'last_name']}
            initialFormValues={{ project_id: project.id, type: 'Leader' }}
            form={AffiliateForm}
            showComponent={AffiliateShow}
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
