import { useMemo } from 'react';

/**
 * Reads a project's total collection count, treating an omitted count as zero.
 *
 * @param {Object} item - Project summary.
 * @returns {number} Total number of collections.
 */
const defaultGetCount = (item) => item.collection_counts?.total ?? 0;

/**
 * Finds the collection-count range for the project list and its sidebar filter.
 *
 * @param {Object} options - Items and optional custom count reader.
 * @param {Object[]} options.items - Project summaries.
 * @param {function(Object): number} [options.getCount=defaultGetCount] - Reads a count from each item.
 * @returns {{globalCollectionMin: number, globalCollectionMax: number}} Range, or zeros for an empty list.
 */
export function useProjectsAndCollectionsRange({
    items,
    getCount = defaultGetCount,
}) {
    return useMemo(() => {
        const counts = items.map(getCount).filter((n) => Number.isFinite(n));

        if (counts.length === 0) {
            return {
                globalCollectionMin: 0,
                globalCollectionMax: 0,
            };
        }

        return {
            globalCollectionMin: Math.min(...counts),
            globalCollectionMax: Math.max(...counts),
        };
    }, [items, getCount]);
}
