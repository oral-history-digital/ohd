import { act, renderHook } from '@testing-library/react';

import { useTranscriptBookmarks } from './useTranscriptBookmarks';

jest.mock('modules/workbook', () => ({
    useWorkbook: jest.fn(),
}));

const { useWorkbook } = jest.requireMock('modules/workbook');

describe('useTranscriptBookmarks', () => {
    let result;

    const render = () => {
        result = renderHook(() => useTranscriptBookmarks()).result;
    };

    beforeEach(() => {
        useWorkbook.mockReturnValue({ savedSegments: [] });
    });

    afterEach(() => {
        result = null;
        useWorkbook.mockReset();
    });

    it('builds bookmarked segment ids from workbook annotations', () => {
        useWorkbook.mockReturnValue({
            savedSegments: [
                {
                    id: 1,
                    reference_type: 'Segment',
                    reference_id: 10,
                },
                {
                    id: 2,
                    reference_type: 'InterviewReference',
                    reference_id: 999,
                },
                {
                    id: 3,
                    reference_type: 'Segment',
                    reference_id: 20,
                },
            ],
        });

        render();

        expect(result.current.bookmarkedSegmentIds.has(10)).toBe(true);
        expect(result.current.bookmarkedSegmentIds.has(20)).toBe(true);
        expect(result.current.bookmarkedSegmentIds.has(999)).toBe(false);
    });

    it('opens and closes selected bookmark segment', () => {
        render();

        const segment = { id: 77 };

        act(() => {
            result.current.handleBookmarkCreate(segment);
        });

        expect(result.current.selectedBookmarkSegment).toEqual(segment);

        act(() => {
            result.current.handleBookmarkModalClose();
        });

        expect(result.current.selectedBookmarkSegment).toBeNull();
    });
});
