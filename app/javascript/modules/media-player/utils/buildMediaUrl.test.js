import { buildMediaUrl } from './buildMediaUrl';

test('builds normal media urls', () => {
    const actual = buildMediaUrl('mp4', '/de', 'adg004', 2, '240p');
    const expected = '/de/media_streams/adg004/2/240p.mp4';

    expect(actual).toEqual(expected);
});

test('builds media urls for hls videos', () => {
    const actual = buildMediaUrl('m3u8', '/ev/de', 'ev002', 4, 'hls');
    const expected = '/ev/de/media_streams/ev002/4/hls.m3u8';

    expect(actual).toEqual(expected);
});
