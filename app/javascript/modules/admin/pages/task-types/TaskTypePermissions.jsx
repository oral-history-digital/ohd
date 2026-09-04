import { getEditView } from 'modules/archive';
import { getPermissions, getPermissionsStatus } from 'modules/data';
import { useSelector } from 'react-redux';

import { DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function TaskTypePermissions() {
    const editView = useSelector(getEditView);
    const joinDataStatus = useSelector(getPermissionsStatus);
    const permissions = useSelector(getPermissions);
    const { fetchData, deleteData, submitData } = useAdminDataActions();

    return (
        <DataList
            editView={editView}
            joinDataStatus={joinDataStatus}
            joinDataScope="permissions"
            scope="task_type_permission"
            detailsAttributes={['name', 'desc', 'klass', 'action_name']}
            formElements={[
                {
                    elementType: 'select',
                    attribute: 'permission_id',
                    values: permissions,
                    withEmpty: true,
                    validate: (v) => v?.length > 0,
                },
            ]}
            hideEdit
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
        />
    );
}
