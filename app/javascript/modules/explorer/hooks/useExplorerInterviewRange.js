import { useMemo } from 'react';

/**
 * Returns the global min/max interview counts across
 * all archives and institutions in the dummy data.
 */
export function useExplorerInterviewRange({ archives, institutions }) {
    return useMemo(() => {
        const counts = [
            ...archives.map((a) => a.interviews?.total ?? 0),
            ...institutions.map((i) => i.interviews?.total ?? 0),
        ].filter((n) => !isNaN(n));

        return {
            globalMin: Math.min(...counts),
            globalMax: Math.max(...counts),
        };
    }, [archives, institutions]);
}
