import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        tape: 2,
        mediaTime: 12.46,
        isPlaying: true,
        resolution: '720p',
    },
};

test('getCurrentTape retrieves current tape number', () => {
    expect(selectors.getCurrentTape(state)).toEqual(state[NAME].tape);
});

test('getMediaTime retrieves media time', () => {
    expect(selectors.getMediaTime(state)).toEqual(state[NAME].mediaTime);
});

test('getIsPlaying retrieves wether medium is playing', () => {
    expect(selectors.getIsPlaying(state)).toEqual(state[NAME].isPlaying);
});

test('getResolution retrieves media resolution', () => {
    expect(selectors.getResolution(state)).toEqual(state[NAME].resolution);
});
