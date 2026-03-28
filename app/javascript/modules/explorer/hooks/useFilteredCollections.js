import { useMemo } from 'react';

import { filterCollections } from '../utils';

/**
 * Memoized collections filtering for the explorer collection cards.
 */
export function useFilteredCollections({ collections, query }) {
    return useMemo(
        () => filterCollections(collections || [], query),
        [collections, query]
    );
}
