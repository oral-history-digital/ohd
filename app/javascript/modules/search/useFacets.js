import useSWRImmutable from 'swr/immutable';
import queryString from 'query-string';
import range from 'lodash.range';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { useSearchParams } from 'modules/query-string';

export default function useFacets() {
    const { fulltext, facets, yearOfBirthMin, yearOfBirthMax } =
        useSearchParams();
    const pathBase = usePathBase();

    const params = {
        fulltext,
        ...facets,
        year_of_birth: range(yearOfBirthMin, yearOfBirthMax + 1),
    };
    const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });
    const path = `${pathBase}/searches/facets?${paramStr}`;

    const { isValidating, isLoading, data, error } = useSWRImmutable(
        path,
        fetcher,
        {
            keepPreviousData: true,
        }
    );

    return {
        facets: data?.facets,
        error,
        isValidating,
        isLoading,
    };
}
