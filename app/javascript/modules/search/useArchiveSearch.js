import useSWRInfinite from 'swr/infinite';
import queryString from 'query-string';

import { fetcher } from 'modules/api';
import { usePathBase } from 'modules/routes';

function transformData(data) {
    const combinedResults = [];

    data.forEach(datum => {
        datum.interviews.forEach(interview => combinedResults.push(interview));
    });

    return {
        total: data[0].results_count,
        numPages: data[0].result_pages_count,
        interviews: combinedResults,
    };
}

export default function useArchiveSearch(sortBy, sortOrder, isLoggedIn) {
    const pathBase = usePathBase();

    function getKey(pageIndex, previousPageData) {
        const params = {
            page: pageIndex + 1,
            sort: sortBy,
            order: sortOrder,
            'logged-in': isLoggedIn, // just to build different keys
        };
        const paramStr = queryString.stringify(params);
        return `${pathBase}/searches/archive?${paramStr}`;
    }

    const { data, error, isValidating, size, setSize } =
        useSWRInfinite(getKey, fetcher);

    let transformedData;
    if (data) {
        console.log(data);
        transformedData = transformData(data);
    }

    console.log(data, error, isValidating);

    return { data: transformedData, error, isValidating, size, setSize };
}
