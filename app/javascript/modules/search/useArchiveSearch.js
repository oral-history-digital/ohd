import range from 'lodash.range';
import { fetcher } from 'modules/api';
import { useSearchParams } from 'modules/query-string';
import { usePathBase, useProject } from 'modules/routes';
import { getIsLoggedIn, getLoggedInAt } from 'modules/user';
import queryString from 'query-string';
import { useSelector } from 'react-redux';
import useSWRInfinite from 'swr/infinite';

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

/**
 * Fetches paginated interview search results after Redux project settings are available.
 * Uses the project's default order unless the URL specifies a sort, and hides results
 * while project settings are unavailable after route or access changes.
 *
 * @returns {Object} Interview pages, combined results, loading/error state, and pagination controls.
 */
export default function useArchiveSearch() {
    const {
        project,
        isLoading: projectIsLoading,
        isValidating: projectIsValidating,
        error: projectError,
    } = useProject();
    const isLoggedIn = useSelector(getIsLoggedIn);
    const loggedInAt = useSelector(getLoggedInAt);
    const {
        sortBy,
        sortOrder,
        fulltext,
        facets,
        yearOfBirthMin,
        yearOfBirthMax,
        interviewYearMin,
        interviewYearMax,
    } = useSearchParams();
    const pathBase = usePathBase();

    /**
     * Builds a page URL using the current project settings and account context.
     *
     * @param {number} pageIndex - Zero-based result page.
     * @returns {string|null} Search URL, or null while project settings are unavailable.
     */
    function getKey(pageIndex) {
        if (!project) return null;

        const params = {
            fulltext,
            ...facets,
            year_of_birth: range(yearOfBirthMin, yearOfBirthMax + 1),
            interview_year: range(interviewYearMin, interviewYearMax + 1),
            sort: sortBy,
            order: sortOrder,
            page: pageIndex + 1,
            'logged-in': isLoggedIn, // just to build different keys
            'logged-in-at': isLoggedIn ? loggedInAt : undefined,
        };

        // Set defaults if sort options are not set.
        if (!params.sort) {
            const defaults = defaultSortOptions(project.default_search_order);
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
            keepPreviousData: false,
            revalidateFirstPage: false,
            revalidateOnFocus: false,
        });

    // SWR can retain pages when its key becomes null; do not expose them without current project settings.
    const pages = project ? data : undefined;
    const transformedData = pages ? transformData(pages) : undefined;

    return {
        interviews: transformedData,
        total: pages?.[0].results_count,
        fulltext: pages?.[0].fulltext,
        data: pages,
        error: projectError || (project ? error : undefined),
        isLoading: projectIsLoading || (Boolean(project) && isLoading),
        isValidating: projectIsValidating || (Boolean(project) && isValidating),
        size,
        setSize,
    };
}
