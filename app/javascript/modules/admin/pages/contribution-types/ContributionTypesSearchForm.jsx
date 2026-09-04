import { getContributionTypesQuery } from 'modules/search';

import DataSearchForm from '../../DataSearchForm';
import { useAdminSearch } from '../../hooks';

export default function ContributionTypesSearchForm() {
    const searchProps = useAdminSearch(getContributionTypesQuery);

    return (
        <DataSearchForm
            {...searchProps}
            scope="contribution_type"
            searchableAttributes={[
                { attributeName: 'label' },
                { attributeName: 'code' },
            ]}
        />
    );
}
