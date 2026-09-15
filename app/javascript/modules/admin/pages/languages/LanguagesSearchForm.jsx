import { getLanguagesQuery } from 'modules/search';

import { DataSearchForm } from '../../components';
import { useAdminSearch } from '../../hooks';

export default function LanguagesSearchForm() {
    const searchProps = useAdminSearch(getLanguagesQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="language"
            searchableAttributes={[
                { attributeName: 'name' },
                { attributeName: 'code' },
            ]}
        />
    );
}
