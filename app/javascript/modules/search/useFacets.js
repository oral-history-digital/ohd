import useSWRImmutable from 'swr/immutable';
import queryString from 'query-string';
import range from 'lodash.range';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSearchParams from './useSearchParams';

export default function useFacets() {
    const { fulltext, facets, birthYearMin, birthYearMax } = useSearchParams();
    const pathBase = usePathBase();

    const params = {
        fulltext,
        ...facets,
        year_of_birth: range(birthYearMin, birthYearMax + 1),
    };
    const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });
    const path = `${pathBase}/searches/facets?${paramStr}`;

    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    return {
        facets: data?.facets,
        error,
        isValidating,
    };
}
