import useSWRInfinite from 'swr/infinite';
import queryString from 'query-string';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

function transformData(data) {
    const combinedResults = [];

    data.forEach(datum => {
        datum.interviews.forEach(interview => combinedResults.push(interview));
    });

    return combinedResults;
}

export default function useArchiveSearch(sortBy, sortOrder, fulltext, isLoggedIn) {
    const pathBase = usePathBase();

    function getKey(pageIndex, previousPageData) {
        const params = {
            fulltext,
            sort: sortBy,
            order: sortOrder,
            page: pageIndex + 1,
            'logged-in': isLoggedIn, // just to build different keys
        };
        const paramStr = queryString.stringify(params);
        return `${pathBase}/searches/archive?${paramStr}`;
    }

    const { data, error, isValidating, size, setSize } =
        useSWRInfinite(getKey, fetcher, {
            revalidateOnFocus: false,
        });

    let transformedData;
    if (data) {
        transformedData = transformData(data);
    }

    return {
        interviews: transformedData,
        total: data?.[0].results_count,
        data,
        error,
        isValidating,
        size,
        setSize,
    };
}
