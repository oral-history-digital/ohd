import { renderHook } from '@testing-library/react';

import { useExplorerInterviewRange } from './useExplorerInterviewRange';
import { useProjectsAndCollectionsRange } from './useProjectsAndCollectionsRange';

test('reads v2 project interview counts and updates when the item type changes', () => {
    const { result, rerender } = renderHook(
        (options) => useExplorerInterviewRange(options),
        {
            initialProps: {
                items: [{ interview_counts: { total: 12 } }, {}],
                countField: 'interview_counts',
            },
        }
    );
    expect(result.current).toEqual({ globalMin: 0, globalMax: 12 });

    rerender({ items: [{ interviews: { total: 7 } }] });
    expect(result.current).toEqual({ globalMin: 0, globalMax: 7 });
});

test('reads v2 project collection counts and treats omitted counts as zero', () => {
    const { result } = renderHook(() =>
        useProjectsAndCollectionsRange({
            items: [{ collection_counts: { total: 4 } }, {}],
        })
    );
    expect(result.current).toEqual({
        globalCollectionMin: 0,
        globalCollectionMax: 4,
    });
});

test('returns zero ranges for empty lists', () => {
    const { result } = renderHook(() => ({
        interviews: useExplorerInterviewRange({ items: [] }),
        collections: useProjectsAndCollectionsRange({ items: [] }),
    }));
    expect(result.current).toEqual({
        interviews: { globalMin: 0, globalMax: 0 },
        collections: { globalCollectionMin: 0, globalCollectionMax: 0 },
    });
});
