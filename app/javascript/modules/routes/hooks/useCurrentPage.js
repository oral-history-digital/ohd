import { useMemo } from 'react';

import { useLocation } from 'react-router-dom';

import useProject from '../useProject';
import { getCurrentPageFromLocation } from '../utils';

/**
 * Resolves the current route location into a normalized page context object.
 */
export function useCurrentPage() {
    const location = useLocation();
    const { project } = useProject();

    return useMemo(() => {
        const currentPage = getCurrentPageFromLocation({
            pathname: location.pathname,
            search: location.search,
        });

        // OHD root (/:locale) renders the site-wide startpage, not a project startpage.
        if (
            currentPage.pageType === 'project_startpage' &&
            !currentPage.params?.projectId &&
            project?.is_ohd
        ) {
            return {
                ...currentPage,
                pageType: 'site_startpage',
            };
        }

        return currentPage;
    }, [location.pathname, location.search, project]);
}
