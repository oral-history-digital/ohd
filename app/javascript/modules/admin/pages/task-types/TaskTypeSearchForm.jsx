import { getTaskTypesQuery } from 'modules/search';

import DataSearchForm from '../../DataSearchForm';
import { useAdminSearch } from '../../hooks';

export default function TaskTypeSearchForm() {
    const searchProps = useAdminSearch(getTaskTypesQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="task_type"
            searchableAttributes={[{ attributeName: 'label' }]}
        />
    );
}
