import { useCallback } from 'react';

import {
    deleteData,
    fetchData,
    getPermissions,
    getPermissionsStatus,
    submitData,
} from 'modules/data';
import { getPermissionsQuery, setQueryParams } from 'modules/search';
import { useDispatch, useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';

export default function PermissionsAdminPage() {
    const dispatch = useDispatch();
    const data = useSelector(getPermissions);
    const dataStatus = useSelector(getPermissionsStatus);
    const query = useSelector(getPermissionsQuery);
    const fetchAdminData = useCallback(
        (...args) => dispatch(fetchData(...args)),
        [dispatch]
    );
    const deleteAdminData = useCallback(
        (...args) => dispatch(deleteData(...args)),
        [dispatch]
    );
    const submitAdminData = useCallback(
        (...args) => dispatch(submitData(...args)),
        [dispatch]
    );
    const updateQueryParams = useCallback(
        (...args) => dispatch(setQueryParams(...args)),
        [dispatch]
    );

    return (
        <PaginatedAdminRecordList
            data={data}
            dataStatus={dataStatus}
            resultPagesCount={dataStatus.resultPagesCount}
            query={query}
            scope="permission"
            detailsAttributes={['name', 'desc', 'klass', 'action_name']}
            formElements={[
                {
                    attribute: 'name',
                    validate: function (v) {
                        return v?.length > 1;
                    },
                },
                {
                    elementType: 'textarea',
                    attribute: 'desc',
                },
                {
                    attribute: 'klass',
                    validate: function (v) {
                        return v?.length > 1;
                    },
                },
                {
                    attribute: 'action_name',
                    validate: function (v) {
                        return v?.length > 1;
                    },
                },
            ]}
            helpTextCode="permission_form"
            fetchData={fetchAdminData}
            deleteData={deleteAdminData}
            submitData={submitAdminData}
            setQueryParams={updateQueryParams}
        />
    );
}
