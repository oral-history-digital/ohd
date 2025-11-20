import range from 'lodash.range';
import { fetcher } from 'modules/api';
import { getEditView } from 'modules/archive';
import { useSearchParams } from 'modules/query-string';
import { usePathBase } from 'modules/routes';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';

export default function useMapLocations() {
    const pathBase = usePathBase();
    const isEditView = useSelector(getEditView);

    const { facets, yearOfBirthMin, yearOfBirthMax } = useSearchParams();

    const params = {
        ...facets,
        year_of_birth: range(yearOfBirthMin, yearOfBirthMax + 1),
        all: isEditView ? true : undefined,
    };
    const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });

    const path = `${pathBase}/searches/map?${paramStr}`;
    const { isLoading, isValidating, data, error } = useSWRImmutable(
        path,
        fetcher,
        { keepPreviousData: true }
    );

    return { isLoading, isValidating, locations: data, error };
}
