import useSWRInfinite from 'swr/infinite';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import range from 'lodash.range';

import { getIsLoggedIn } from 'modules/account';
import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';
import useSearchParams from './useSearchParams';

function transformData(data) {
    const combinedResults = [];

    data.forEach(datum => {
        datum.interviews.forEach(interview => combinedResults.push(interview));
    });

    return combinedResults;
}

export default function useArchiveSearch() {
    const isLoggedIn = useSelector(getIsLoggedIn);
    const { sortBy, sortOrder, fulltext, facets, yearOfBirthMin,
        yearOfBirthMax } = useSearchParams();
    const pathBase = usePathBase();

    function getKey(pageIndex, previousPageData) {
        const params = {
            fulltext,
            ...facets,
            year_of_birth: range(yearOfBirthMin, yearOfBirthMax + 1),
            sort: sortBy,
            order: sortOrder,
            page: pageIndex + 1,
            'logged-in': isLoggedIn, // just to build different keys
        };
        const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });
        return `${pathBase}/searches/archive?${paramStr}`;
    }

    const { data, error, isValidating, isLoading, size, setSize } =
        useSWRInfinite(getKey, fetcher, {
            revalidateOnFocus: false,
            keepPreviousData: true,
        });

    let transformedData;
    if (data) {
        transformedData = transformData(data);
    }

    console.log(data?.[0].fulltext)

    return {
        interviews: transformedData,
        total: data?.[0].results_count,
        fulltext: data?.[0].fulltext,
        data,
        error,
        isLoading,
        isValidating,
        size,
        setSize,
    };
}
