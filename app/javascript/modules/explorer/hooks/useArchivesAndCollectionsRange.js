import { useMemo } from 'react';

const defaultGetCount = (item) => item.collections?.total ?? 0;

export function useArchivesAndCollectionsRange({
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
