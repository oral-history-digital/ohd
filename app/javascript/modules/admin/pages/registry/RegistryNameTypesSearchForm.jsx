import { getRegistryNameTypesQuery } from 'modules/search';

import { DataSearchForm } from '../../components';
import { useAdminSearch } from '../../hooks';

export default function RegistryNameTypesSearchForm() {
    const searchProps = useAdminSearch(getRegistryNameTypesQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="registry_name_type"
            searchableAttributes={[
                { attributeName: 'name' },
                { attributeName: 'code' },
            ]}
        />
    );
}
