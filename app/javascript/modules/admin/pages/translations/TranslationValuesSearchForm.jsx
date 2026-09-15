import { getTranslationValuesQuery } from 'modules/search';

import { DataSearchForm } from '../../components';
import { useAdminSearch } from '../../hooks';

export default function TranslationValuesSearchForm() {
    const searchProps = useAdminSearch(getTranslationValuesQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="translation_value"
            searchableAttributes={[
                { attributeName: 'key' },
                { attributeName: 'value' },
            ]}
        />
    );
}
