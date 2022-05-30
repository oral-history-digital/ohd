import buildMediaUrl from './buildMediaUrl';

test('builds normal media urls', () => {
    const path = 'https://medien.cedis.fu-berlin.de/ohd/adg/INTERVIEW_ID/INTERVIEW_ID_TAPE_COUNT_TAPE_NUMBER_240p.mp4';

    const actual = buildMediaUrl(path, 'adg004', '04', 2);
    const expected = 'https://medien.cedis.fu-berlin.de/ohd/adg/adg004/adg004_04_02_240p.mp4';

    expect(actual).toEqual(expected);
});

test('builds media urls for hls videos', () => {
    const path = 'https://medien.cedis.fu-berlin.de/eiserner_vorhang/hls/INTERVIEW_ID/INTERVIEW_ID/INTERVIEW_ID.m3u8';

    const actual = buildMediaUrl(path, 'ev002', '04', 2);
    const expected = 'https://medien.cedis.fu-berlin.de/eiserner_vorhang/hls/ev002/ev002/ev002.m3u8';

    expect(actual).toEqual(expected);
});
