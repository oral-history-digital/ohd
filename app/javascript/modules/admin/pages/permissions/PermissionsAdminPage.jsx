import { getPermissions, getPermissionsStatus } from 'modules/data';
import { getPermissionsQuery } from 'modules/search';
import { useSelector } from 'react-redux';

import { PaginatedAdminRecordList } from '../../components';
import { useAdminDataActions } from '../../hooks';

export default function PermissionsAdminPage() {
    const data = useSelector(getPermissions);
    const dataStatus = useSelector(getPermissionsStatus);
    const query = useSelector(getPermissionsQuery);
    const { fetchData, deleteData, submitData, setQueryParams } =
        useAdminDataActions();

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
            fetchData={fetchData}
            deleteData={deleteData}
            submitData={submitData}
            setQueryParams={setQueryParams}
        />
    );
}
