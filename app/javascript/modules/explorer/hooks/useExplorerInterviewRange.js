import { useMemo } from 'react';

/**
 * Returns the global min/max interview counts across the provided items.
 */
export function useExplorerInterviewRange({ items }) {
    return useMemo(() => {
        const counts = items
            .map((item) => item.interviews?.total ?? 0)
            .filter((n) => !isNaN(n));

        return {
            globalMin: Math.min(...counts),
            globalMax: Math.max(...counts),
        };
    }, [items]);
}
