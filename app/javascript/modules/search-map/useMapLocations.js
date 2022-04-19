import { useSelector } from 'react-redux';
import queryString from 'query-string';
import useSWRImmutable from 'swr/immutable';
import range from 'lodash.range';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import { getEditView } from 'modules/archive';
import { useSearchParams } from 'modules/search';

export default function useMapLocations() {
    const pathBase = usePathBase();
    const isEditView = useSelector(getEditView);

    const { facets, birthYearMin, birthYearMax } = useSearchParams();

    const params = {
        ...facets,
        year_of_birth: range(birthYearMin, birthYearMax + 1),
        all: isEditView ? true : undefined,
    };
    const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });

    const path = `${pathBase}/searches/map?${paramStr}`;
    const { isValidating, data, error } = useSWRImmutable(path, fetcher);

    return { isValidating, locations: data, error };
}
