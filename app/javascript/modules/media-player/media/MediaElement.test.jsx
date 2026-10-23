/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { useProject } from 'modules/routes';

import MediaElement from './MediaElement';
import VideoJS from './VideoJS';

jest.mock('modules/routes', () => ({
    useProject: jest.fn(),
    usePathBase: () => '/pilot/en',
}));
jest.mock('modules/archive', () => ({ getTranslationsView: jest.fn() }));
jest.mock('react-redux', () => ({ useSelector: () => false }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key, locale: 'en' }),
}));
jest.mock('modules/query-string', () => ({ useTimeQueryString: () => ({}) }));
jest.mock('modules/spinners', () => ({ Spinner: () => <span>Loading</span> }));
jest.mock('modules/ui', () => ({
    InlineNotification: ({ description }) => <p role="alert">{description}</p>,
}));
jest.mock('../hooks', () => ({
    useGetMediaMissingText: () => 'Custom missing message',
    useMediaPlayerResize: () => ({}),
    usePosterImage: () => ({ posterUrl: '/poster.jpg' }),
    useTimecodeFormat: () => 'ms',
}));
jest.mock('../plugins/configurationMenuPlugin.js', () => ({}));
jest.mock('../plugins/customSkipButtonsPlugin.js', () => ({}));
jest.mock('../plugins/fractionalCurrentTimePlugin.js', () => ({}));
jest.mock('../plugins/toggleSizeButtonPlugin.js', () => ({}));
jest.mock('./VideoJS', () => jest.fn(() => <p>Player</p>));

const project = {
    aspect_x: 16,
    aspect_y: 9,
    media_streams: [{ media_type: 'video', resolution: 'hls', suffix: 'm3u8' }],
};
const props = {
    archiveId: 'pilot001',
    interview: {
        media_type: 'video',
        tape_count: 2,
        alpha3s_with_transcript: ['eng'],
        transcript_coupled: true,
    },
    tape: 1,
    updateIsPlaying: jest.fn(),
    updateMediaTime: jest.fn(),
    resetMedia: jest.fn(),
    sendTimeChangeRequest: jest.fn(),
    clearTimeChangeRequest: jest.fn(),
};

beforeEach(() => {
    jest.clearAllMocks();
    useProject.mockReturnValue({ project });
});

test('waits for playback settings, then initializes sources, aspect ratio, and tape subtitles', () => {
    useProject.mockReturnValue({ isLoading: true });
    const { rerender } = render(<MediaElement {...props} />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(VideoJS).not.toHaveBeenCalled();
    expect(useProject).toHaveBeenCalledWith({ include: ['playback'] });
    useProject.mockReturnValue({ project });
    rerender(<MediaElement {...props} />);
    const playerProps = VideoJS.mock.calls.at(-1)[0];
    expect(playerProps.options).toMatchObject({
        aspectRatio: '16:9',
        language: 'en',
        sources: [{ src: '/pilot/en/media_streams/pilot001/1/hls.m3u8' }],
    });
    const player = {
        configurationMenuPlugin: jest.fn(),
        toggleSizePlugin: jest.fn(),
        customSkipButtonsPlugin: jest.fn(),
        currentSources: () => [],
        ready: jest.fn(),
        on: jest.fn(),
        paused: () => true,
        remoteTextTracks: () => [],
        addRemoteTextTrack: jest.fn(),
        src: jest.fn(),
    };
    playerProps.onReady(player);
    expect(player.addRemoteTextTrack).toHaveBeenCalledWith(
        expect.objectContaining({
            src: '/pilot/en/interviews/pilot001.vtt?lang=eng&tape_number=1',
        }),
        false
    );
    rerender(<MediaElement {...props} tape={2} />);
    expect(player.src).toHaveBeenCalledWith([
        expect.objectContaining({
            src: '/pilot/en/media_streams/pilot001/2/hls.m3u8',
        }),
    ]);
    expect(player.addRemoteTextTrack).toHaveBeenLastCalledWith(
        expect.objectContaining({
            src: '/pilot/en/interviews/pilot001.vtt?lang=eng&tape_number=2',
        }),
        false
    );
    delete window.mainPlayerInstance;
});

test('shows missing-media text and replaces retained playback with request errors', () => {
    const { rerender } = render(
        <MediaElement
            {...props}
            interview={{ ...props.interview, media_missing: true }}
        />
    );
    expect(screen.getByText('Custom missing message')).toBeInTheDocument();
    expect(screen.queryByText('Player')).not.toBeInTheDocument();
    useProject.mockReturnValue({
        project,
        error: { message: 'Access denied' },
    });
    rerender(<MediaElement {...props} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Access denied');
    expect(screen.queryByText('Player')).not.toBeInTheDocument();
});
