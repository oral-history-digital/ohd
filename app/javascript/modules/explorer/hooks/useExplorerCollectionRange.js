import { useMemo } from 'react';

export function useExplorerCollectionRange({ archives }) {
    return useMemo(() => {
        const counts = archives
            .map((a) => a.collections?.total ?? 0)
            .filter((n) => !isNaN(n));

        return {
            globalCollectionMin: Math.min(...counts),
            globalCollectionMax: Math.max(...counts),
        };
    }, [archives]);
}
