import { buildMediaUrl } from './buildMediaUrl';

test('builds normal media urls', () => {
    const path =
        'https://medien.cedis.fu-berlin.de/ohd/adg/INTERVIEW_ID/INTERVIEW_ID_TAPE_COUNT_TAPE_NUMBER_240p.mp4';

    const actual = buildMediaUrl(path, '/de', 'adg004', 2, '240p');
    const expected = '/de/media_streams/adg004/2/240p.mp4';

    expect(actual).toEqual(expected);
});

test('builds media urls for hls videos', () => {
    const path =
        'https://medien.cedis.fu-berlin.de/eiserner_vorhang/hls/INTERVIEW_ID/INTERVIEW_ID/INTERVIEW_ID.m3u8';

    const actual = buildMediaUrl(path, '/ev/de', 'ev002', 4, 'hls');
    const expected = '/ev/de/media_streams/ev002/4/hls.m3u8';

    expect(actual).toEqual(expected);
});
