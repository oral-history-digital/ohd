import useSWRInfinite from 'swr/infinite';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import range from 'lodash.range';

import { getIsLoggedIn } from 'modules/user';
import { fetcher } from 'modules/api';
import { getCurrentProject } from 'modules/data';
import { usePathBase } from 'modules/routes';
import { useSearchParams } from 'modules/query-string';
import defaultSortOptions from './defaultSortOptions';

function transformData(data) {
    const combinedResults = [];

    data.forEach((datum) => {
        datum.interviews.forEach((interview) =>
            combinedResults.push(interview)
        );
    });

    return combinedResults;
}

export default function useArchiveSearch() {
    const project = useSelector(getCurrentProject);
    const isLoggedIn = useSelector(getIsLoggedIn);
    const {
        sortBy,
        sortOrder,
        fulltext,
        facets,
        yearOfBirthMin,
        yearOfBirthMax,
    } = useSearchParams();
    const pathBase = usePathBase();

    function getKey(pageIndex) {
        const params = {
            fulltext,
            ...facets,
            year_of_birth: range(yearOfBirthMin, yearOfBirthMax + 1),
            sort: sortBy,
            order: sortOrder,
            page: pageIndex + 1,
            'logged-in': isLoggedIn, // just to build different keys
        };

        // Set defaults if sort options are not set.
        if (!params.sort) {
            const defaults = defaultSortOptions(project?.default_search_order);
            params.sort = defaults.sort;
            params.order = defaults.order;
        }

        const paramStr = queryString.stringify(params, {
            arrayFormat: 'bracket',
        });
        return `${pathBase}/searches/archive?${paramStr}`;
    }

    const { data, error, isValidating, isLoading, size, setSize } =
        useSWRInfinite(getKey, fetcher, {
            keepPreviousData: true,
            revalidateFirstPage: false,
            revalidateOnFocus: false,
        });

    let transformedData;
    if (data) {
        transformedData = transformData(data);
    }

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
