import { getProjectsQuery } from 'modules/search';

import DataSearchForm from '../../DataSearchForm';
import { useAdminSearch } from '../../hooks';

// TODO: Consider removing ProjectSearchForm; it has no in-repository consumer.
export default function ProjectSearchForm() {
    const searchProps = useAdminSearch(getProjectsQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="project"
            searchableAttributes={[{ attributeName: 'name' }]}
        />
    );
}
