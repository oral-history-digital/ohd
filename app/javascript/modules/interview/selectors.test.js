import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        tape: 2,
        videoTime: 0,
        videoStatus: 'pause',
        transcriptTime: 13.46,
        transcriptScrollEnabled: true,
        resolution: '720p',
        tabIndex: 2,
    },
};

test('getCurrentTape retrieves current tape number', () => {
    expect(selectors.getCurrentTape(state)).toEqual(state[NAME].tape);
});

test('getVideoTime retrieves video time', () => {
    expect(selectors.getVideoTime(state)).toEqual(state[NAME].videoTime);
});

test('getVideoStatus retrieves video status', () => {
    expect(selectors.getVideoStatus(state)).toEqual(state[NAME].videoStatus);
});

test('getTranscriptTime retrieves transcript time', () => {
    expect(selectors.getTranscriptTime(state)).toEqual(state[NAME].transcriptTime);
});

test('getTranscriptScrollEnabled retrieves if video is fixed', () => {
    expect(selectors.getTranscriptScrollEnabled(state)).toEqual(state[NAME].transcriptScrollEnabled);
});

test('getVideoResolution retrieves video resolution', () => {
    expect(selectors.getVideoResolution(state)).toEqual(state[NAME].resolution);
});

test('getTabIndex retrieves index of interview tabs', () => {
    expect(selectors.getTabIndex(state)).toEqual(state[NAME].tabIndex);
});
