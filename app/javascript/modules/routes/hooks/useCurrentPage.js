import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import useProject from '../useProject';
import {
    getCurrentPageFromLocation,
    normalizeCurrentPageWithProjectContext,
} from '../utils';

/**
 * Resolves the current route location into a normalized page context object.
 */
export function useCurrentPage() {
    const location = useLocation();
    const {
        projectShortname,
        projectDbId: projectId,
        isUmbrella,
    } = useProject();

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
