import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import useProjectIdentity from '../useProjectIdentity';
import {
    getCurrentPageFromLocation,
    normalizeCurrentPageWithProjectContext,
} from '../utils';

/**
 * Resolves the current route and project identity without loading project details.
 *
 * @returns {Object} Normalized page context with route parameters and project identifiers.
 */
export function useCurrentPage() {
    const location = useLocation();
    const {
        projectShortname,
        projectDbId: projectId,
        isUmbrella,
    } = useProjectIdentity();

    return useMemo(() => {
        const currentPage = getCurrentPageFromLocation({
            pathname: location.pathname,
            search: location.search,
        });

        return normalizeCurrentPageWithProjectContext(currentPage, {
            isUmbrella,
            projectShortname,
            projectId,
        });
    }, [
        location.pathname,
        location.search,
        isUmbrella,
        projectShortname,
        projectId,
    ]);
}
