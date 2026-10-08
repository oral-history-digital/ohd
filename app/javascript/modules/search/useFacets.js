import range from 'lodash.range';
import { fetcher } from 'modules/api';
import { useSearchParams } from 'modules/query-string';
import { usePathBase } from 'modules/routes';
import { getIsLoggedIn, getLoggedInAt } from 'modules/user';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import useSWRImmutable from 'swr/immutable';

export default function useFacets() {
    const {
        fulltext,
        facets,
        yearOfBirthMin,
        yearOfBirthMax,
        interviewYearMin,
        interviewYearMax,
    } = useSearchParams();
    const pathBase = usePathBase();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const loggedInAt = useSelector(getLoggedInAt);

    const params = {
        'logged-in': isLoggedIn,
        'logged-in-at': isLoggedIn ? loggedInAt : undefined,
        fulltext,
        ...facets,
        year_of_birth: range(yearOfBirthMin, yearOfBirthMax + 1),
        interview_year: range(interviewYearMin, interviewYearMax + 1),
    };
    const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });
    const path = `${pathBase}/searches/facets?${paramStr}`;

    const { isValidating, isLoading, data, error } = useSWRImmutable(
        path,
        fetcher,
        {
            keepPreviousData: false,
        }
    );

    return {
        facets: data?.facets,
        error,
        isValidating,
        isLoading,
    };
}
