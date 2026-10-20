import { mediaStreamsToSources } from './mediaStreamsToSources';

const streams = [
    { media_type: 'video', resolution: '240p', suffix: 'mp4' },
    { media_type: 'video', resolution: 'hls', suffix: 'm3u8' },
    { media_type: 'audio', resolution: '128k', suffix: 'mp3' },
    { media_type: 'still', resolution: 'poster', suffix: 'jpg' },
];

test.each([
    [
        'video',
        [
            {
                src: '/pilot/en/media_streams/pilot001/2/240p.mp4',
                label: '240p',
            },
            {
                src: '/pilot/en/media_streams/pilot001/2/hls.m3u8',
                label: 'hls',
            },
        ],
    ],
    [
        'audio',
        [
            {
                src: '/pilot/en/media_streams/pilot001/2/128k.mp3',
                label: '128k',
                selected: true,
            },
        ],
    ],
])(
    'builds authorized %s sources from playback descriptors without path templates',
    (type, expected) => {
        expect(
            mediaStreamsToSources(streams, '/pilot/en', type, 'pilot001', 3, 2)
        ).toEqual(expected.map((source) => expect.objectContaining(source)));
    }
);
