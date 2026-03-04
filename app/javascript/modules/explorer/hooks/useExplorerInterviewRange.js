import { useMemo } from 'react';

import { archivesData } from '../dummy-data/archives_data';
import { institutionsData } from '../dummy-data/institutions_data';

/**
 * Returns the global min/max interview counts across
 * all archives and institutions in the dummy data.
 */
export function useExplorerInterviewRange() {
    return useMemo(() => {
        const counts = [
            ...archivesData.map((a) => a.interviews?.total ?? 0),
            ...institutionsData.map((i) => i.interviews?.total ?? 0),
        ].filter((n) => !isNaN(n));

        return {
            globalMin: Math.min(...counts),
            globalMax: Math.max(...counts),
        };
    }, []);
}
