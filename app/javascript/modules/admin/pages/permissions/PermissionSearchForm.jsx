import { getPermissionsQuery } from 'modules/search';

import DataSearchForm from '../../DataSearchForm';
import { useAdminSearch } from '../../hooks';

export default function PermissionSearchForm() {
    const searchProps = useAdminSearch(getPermissionsQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="permission"
            searchableAttributes={[
                { attributeName: 'name' },
                { attributeName: 'klass' },
                { attributeName: 'action_name' },
            ]}
        />
    );
}
