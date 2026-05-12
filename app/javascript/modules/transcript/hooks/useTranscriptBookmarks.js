import { useCallback, useMemo, useState } from 'react';

import { useWorkbook } from 'modules/workbook';

export function useTranscriptBookmarks() {
    const { savedSegments } = useWorkbook();
    const [selectedBookmarkSegment, setSelectedBookmarkSegment] =
        useState(null);

    const bookmarkedSegmentIds = useMemo(
        () =>
            new Set(
                (savedSegments || [])
                    .filter(
                        (annotation) => annotation.reference_type === 'Segment'
                    )
                    .map((annotation) => annotation.reference_id)
            ),
        [savedSegments]
    );

    const handleBookmarkCreate = useCallback((segment) => {
        setSelectedBookmarkSegment(segment);
    }, []);

    const handleBookmarkModalClose = useCallback(() => {
        setSelectedBookmarkSegment(null);
    }, []);

    return useMemo(
        () => ({
            bookmarkedSegmentIds,
            selectedBookmarkSegment,
            handleBookmarkCreate,
            handleBookmarkModalClose,
        }),
        [
            bookmarkedSegmentIds,
            selectedBookmarkSegment,
            handleBookmarkCreate,
            handleBookmarkModalClose,
        ]
    );
}
