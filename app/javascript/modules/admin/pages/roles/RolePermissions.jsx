import { getEditView } from 'modules/archive';
import { getPermissions, getPermissionsStatus } from 'modules/data';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { DataList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function RolePermissions({ data, initialFormValues, task }) {
    const editView = useSelector(getEditView);
    const joinDataStatus = useSelector(getPermissionsStatus);
    const permissions = useSelector(getPermissions);
    const { fetchData, deleteData, submitData } = useAdminDataActions();

    return (
        <DataList
            data={data}
            editView={editView}
            initialFormValues={initialFormValues}
            joinDataStatus={joinDataStatus}
            joinDataScope="permissions"
            scope="role_permission"
            detailsAttributes={['name', 'desc', 'klass', 'action_name']}
            formElements={[
                {
                    elementType: 'select',
                    attribute: 'permission_id',
                    values: permissions,
                    withEmpty: true,
                    validate: function (v) {
                        return v?.length > 0;
                    },
                },
            ]}
            hideEdit
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            task={task}
        />
    );
}

RolePermissions.propTypes = {
    data: PropTypes.object,
    initialFormValues: PropTypes.object,
    task: PropTypes.bool,
};
