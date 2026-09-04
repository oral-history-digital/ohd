import { getRolesQuery } from 'modules/search';

import { DataSearchForm } from '../../components';
import { useAdminSearch } from '../../hooks';

export default function RoleSearchForm() {
    const searchProps = useAdminSearch(getRolesQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="role"
            searchableAttributes={[
                { attributeName: 'name' },
                { attributeName: 'desc' },
            ]}
        />
    );
}
