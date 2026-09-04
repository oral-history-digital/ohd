import { getRegistryReferenceTypesQuery } from 'modules/search';

import { DataSearchForm } from '../../components';
import { useAdminSearch } from '../../hooks';

export default function RegistryReferenceTypesSearchForm() {
    const searchProps = useAdminSearch(getRegistryReferenceTypesQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="registry_reference_type"
            searchableAttributes={[
                { attributeName: 'name' },
                { attributeName: 'code' },
            ]}
        />
    );
}
