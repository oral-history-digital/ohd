import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        tape: 2,
        mediaTime: 0,
        mediaStatus: 'pause',
        transcriptTime: 13.46,
        resolution: '720p',
    },
};

test('getCurrentTape retrieves current tape number', () => {
    expect(selectors.getCurrentTape(state)).toEqual(state[NAME].tape);
});

test('getMediaTime retrieves media time', () => {
    expect(selectors.getMediaTime(state)).toEqual(state[NAME].mediaTime);
});

test('getMediaStatus retrieves media status', () => {
    expect(selectors.getMediaStatus(state)).toEqual(state[NAME].mediaStatus);
});

test('getTranscriptTime retrieves transcript time', () => {
    expect(selectors.getTranscriptTime(state)).toEqual(state[NAME].transcriptTime);
});

test('getResolution retrieves media resolution', () => {
    expect(selectors.getResolution(state)).toEqual(state[NAME].resolution);
});
