import { getRolesForCurrentProject, getRolesStatus } from 'modules/data';
import { useProjectIdentity } from 'modules/routes';
import { getRolesQuery } from 'modules/search';
import { Spinner } from 'modules/spinners';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';
import RolePermissions from './RolePermissions';

/**
 * Lists project-scoped resources without loading project details.
 * @returns {React.ReactElement} Administration list or pending project identity.
 */
export default function RolesAdminPage() {
    const { projectDbId } = useProjectIdentity();
    const data = useSelector(getRolesForCurrentProject);
    const dataStatus = useSelector(getRolesStatus);
    const query = useSelector(getRolesQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

    if (!projectDbId) return <Spinner />;

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={query}
            outerScope="project"
            outerScopeId={projectDbId}
            scope="role"
            detailsAttributes={['name', 'desc']}
            initialFormValues={{ project_id: projectDbId }}
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
