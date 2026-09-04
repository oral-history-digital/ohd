import {
    getCurrentProject,
    getRolesForCurrentProject,
    getRolesStatus,
} from 'modules/data';
import { getRolesQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';
import RolePermissions from './RolePermissions';

export default function RolesAdminPage() {
    const project = useSelector(getCurrentProject);
    const data = useSelector(getRolesForCurrentProject);
    const dataStatus = useSelector(getRolesStatus);
    const query = useSelector(getRolesQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={query}
            outerScope="project"
            outerScopeId={project.id}
            scope="role"
            detailsAttributes={['name', 'desc']}
            initialFormValues={{ project_id: project.id }}
            formElements={[
                {
                    attribute: 'name',
                    multiLocale: true,
                    validate: function (v) {
                        return v?.length > 1;
                    },
                },
                {
                    elementType: 'textarea',
                    attribute: 'desc',
                },
            ]}
            joinedData={{ role_permission: RolePermissions }}
            helpTextCode="role_form"
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
