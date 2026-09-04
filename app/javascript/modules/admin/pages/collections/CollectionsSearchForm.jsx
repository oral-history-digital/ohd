import { getCollectionsQuery } from 'modules/search';

import { DataSearchForm } from '../../components';
import { useAdminSearch } from '../../hooks';

export default function CollectionsSearchForm() {
    const { query, fetchData, setQueryParams, resetQuery, hideSidebar } =
        useAdminSearch(getCollectionsQuery);

    return (
        <DataSearchForm
            query={query}
            scope="collection"
            searchableAttributes={[{ attributeName: 'name' }]}
            fetchData={fetchData}
            setQueryParams={setQueryParams}
            resetQuery={resetQuery}
            hideSidebar={hideSidebar}
        />
    );
}
