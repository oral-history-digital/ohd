/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { getArchiveId } from 'modules/archive';
import {
    fetchData,
    getCurrentInterview,
    getTranscriptFetched,
} from 'modules/data';
import { usePathBase } from 'modules/routes';

import Transcript from './Transcript';
import { EditableSegment } from './components';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector(),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/archive', () => ({
    getArchiveId: jest.fn(),
    useIsEditor: () => false,
}));
jest.mock('modules/data', () => ({
    fetchData: jest.fn(() => ({ type: 'fetch' })),
    getCurrentInterview: jest.fn(),
    getCurrentIntervieweeId: () => 3,
    getTranscriptFetched: jest.fn(),
}));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
    isRtlLanguage: () => false,
}));
jest.mock('modules/interview', () => ({ getAutoScroll: () => true }));
jest.mock('modules/media-player', () => ({
    getCurrentTape: () => 1,
    getIsIdle: () => false,
}));
jest.mock('modules/person', () => ({
    useInterviewContributors: () => ({ data: {} }),
}));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('./components', () => ({
    TranscriptSkeleton: () => <p>Loading transcript</p>,
    BookmarkSegmentModal: () => null,
    EditableSegment: jest.fn(({ segment }) => <p>Segment {segment.id}</p>),
}));
jest.mock('./hooks', () => ({
    useProcessedSegments: () => [{ id: 7, speaker_id: 3 }],
    useSegmentEditing: () => ({}),
    useTranscriptBookmarks: () => ({ bookmarkedSegmentIds: new Set([7]) }),
}));
jest.mock('./utils', () => ({
    getContributorInformation: () => ({}),
    getSegmentTimecodeBounds: () => ({}),
}));

beforeEach(() => {
    jest.clearAllMocks();
    getArchiveId.mockReturnValue('pilot001');
    getCurrentInterview.mockReturnValue({
        id: 2,
        alpha3s_with_transcript: ['eng'],
    });
    getTranscriptFetched.mockReturnValue(false);
    usePathBase.mockReturnValue('/pilot/en');
});

test.each(['/pilot/en', '/de'])(
    'loads transcript by public interview ID using %s and preserves bookmarks',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const { rerender } = render(
            <Transcript transcriptLocale="eng" loadSegments />
        );
        expect(fetchData).toHaveBeenCalledWith(
            { pathBase },
            'interviews',
            'pilot001',
            'segments'
        );
        expect(screen.getByText('Loading transcript')).toBeInTheDocument();
        getTranscriptFetched.mockReturnValue(true);
        rerender(<Transcript transcriptLocale="eng" loadSegments />);
        expect(screen.getByText('Segment 7')).toBeInTheDocument();
        expect(EditableSegment.mock.calls.at(-1)[0]).toMatchObject({
            hasBookmarks: true,
            contentLocale: 'eng',
        });
        expect(fetchData).toHaveBeenCalledTimes(1);
    }
);

test('honors disabled segment loading and original/translation empty states', () => {
    const { rerender } = render(
        <Transcript transcriptLocale="deu" loadSegments={false} />
    );
    expect(fetchData).not.toHaveBeenCalled();
    getTranscriptFetched.mockReturnValue(true);
    rerender(
        <Transcript
            transcriptLocale="deu"
            originalLocale
            loadSegments={false}
        />
    );
    expect(screen.getByText('without_transcript')).toBeInTheDocument();
    rerender(<Transcript transcriptLocale="deu" loadSegments={false} />);
    expect(screen.getByText('without_translation')).toBeInTheDocument();
});
