import { useMemo } from 'react';

/**
 * Returns the global min/max interview counts across the provided items.
 */
export function useExplorerInterviewRange({ items }) {
    return useMemo(() => {
        const counts = items
            .map((item) => item.interviews?.total ?? 0)
            .filter((n) => Number.isFinite(n));

        const safeMax = counts.length > 0 ? Math.max(...counts) : 0;

        return {
            globalMin: 0,
            globalMax: safeMax,
        };
    }, [items]);
}
