import mediaStreamsToSources from './mediaStreamsToSources';

test('throws if mediaType is neither audio nor video', () => {
    expect(() => {
        mediaStreamsToSources([], 'dummy');
    }).toThrow(TypeError);
});

test('converts video streams to sources', () => {
    const streams = [
        {
            media_type: 'video',
            path: 'https://medien.cedis.fu-berlin.de/zwar/zwar/INTERVIEW_ID/INTERVIEW_ID_TAPE_COUNT_TAPE_NUMBER_sd240p.mp4',
            resolution: '240p',
        },
        {
            media_type: 'video',
            path: 'https://medien.cedis.fu-berlin.de/zwar/zwar/INTERVIEW_ID/INTERVIEW_ID_TAPE_COUNT_TAPE_NUMBER_sd480p.mp4',
            resolution: '480p',
        },
    ];

    const actual = mediaStreamsToSources(streams, 'video', 'cd003', '05', 3);
    const expected = [
        {
            src: 'https://medien.cedis.fu-berlin.de/zwar/zwar/cd003/cd003_05_03_sd240p.mp4',
            label: '240p',
            selected: false,
        },
        {
            src: 'https://medien.cedis.fu-berlin.de/zwar/zwar/cd003/cd003_05_03_sd480p.mp4',
            label: '480p',
            selected: true,
        },
    ];
    expect(actual).toEqual(expected);
});

test('converts HLS stream to sources', () => {
    const streams = [
        {
            media_type: 'video',
            path: 'https://medien.cedis.fu-berlin.de/zwar/zwar/INTERVIEW_ID/INTERVIEW_ID/INTERVIEW_ID.m3u8',
            resolution: null,
        },
    ];

    const actual = mediaStreamsToSources(streams, 'video', 'cd003', '05', 3);
    const expected = [
        {
            src: 'https://medien.cedis.fu-berlin.de/zwar/zwar/cd003/cd003/cd003.m3u8',
            label: 'default',
            selected: true,
        },
    ];
    expect(actual).toEqual(expected);
});

test('converts audio streams to sources', () => {
    const streams = [
        {
            media_type: 'audio',
            path: 'https://medien.cedis.fu-berlin.de/zwar/zwar/INTERVIEW_ID/INTERVIEW_ID_TAPE_COUNT_TAPE_NUMBER_128k.mp3',
            resolution: '128k',
        },
        {
            media_type: 'audio',
            path: 'https://medien.cedis.fu-berlin.de/zwar/zwar/INTERVIEW_ID/INTERVIEW_ID_TAPE_COUNT_TAPE_NUMBER_192k.mp3',
            resolution: '192k',
        },
    ];

    const actual = mediaStreamsToSources(streams, 'audio', 'cd003', '05', 3);
    const expected = [
        {
            src: 'https://medien.cedis.fu-berlin.de/zwar/zwar/cd003/cd003_05_03_128k.mp3',
            label: '128k',
            selected: false,
        },
        {
            src: 'https://medien.cedis.fu-berlin.de/zwar/zwar/cd003/cd003_05_03_192k.mp3',
            label: '192k',
            selected: true,
        },
    ];
    expect(actual).toEqual(expected);
});
