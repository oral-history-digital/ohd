import { useMemo } from 'react';

const defaultGetCount = (item) => item.collections?.total ?? 0;

export function useExplorerCountRange({ items, getCount = defaultGetCount }) {
    return useMemo(() => {
        const counts = items.map(getCount).filter((n) => !isNaN(n));

        return {
            globalCollectionMin: Math.max(1, Math.min(...counts)),
            globalCollectionMax: Math.max(...counts),
        };
    }, [items, getCount]);
}
