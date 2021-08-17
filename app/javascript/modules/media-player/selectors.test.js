import dotProp from 'dot-prop-immutable';

import * as selectors from './selectors';
import { NAME } from './constants';

const state = {
    [NAME]: {
        tape: 2,
        mediaTime: 12.4,
        isPlaying: true,
        resolution: '720p',
        timeChangeRequest: 31.2,
    },
};

test('getCurrentTape retrieves current tape number', () => {
    expect(selectors.getCurrentTape(state)).toEqual(state[NAME].tape);
});

test('getMediaTime retrieves media time', () => {
    expect(selectors.getMediaTime(state)).toEqual(state[NAME].mediaTime);
});

describe('getIsIdle', () => {
    test('is true if media is at beginning and paused', () => {
        const _state = {
            [NAME]: {
                ...state[NAME],
                tape: 1,
                mediaTime: 0,
                isPlaying: false,
            },
        };
        expect(selectors.getIsIdle(_state)).toBeTruthy();
    });

    test('is false if media is not at beginning', () => {
        expect(selectors.getIsIdle(state)).toBeFalsy();
    });
});

test('getIsPlaying retrieves wether medium is playing', () => {
    expect(selectors.getIsPlaying(state)).toEqual(state[NAME].isPlaying);
});

test('getResolution retrieves media resolution', () => {
    expect(selectors.getResolution(state)).toEqual(state[NAME].resolution);
});

test('getTimeChangeRequest gets requested time change', () => {
    expect(selectors.getTimeChangeRequest(state)).toEqual(state[NAME].timeChangeRequest);
});

describe('getTimeChangeRequestAvailable', () => {
    test('is true if request is available', () => {
        expect(selectors.getTimeChangeRequestAvailable(state)).toBeTruthy();
    });

    test('is false if request is not available', () => {
        const _state = dotProp.set(state, `${NAME}.timeChangeRequest`, null);
        expect(selectors.getTimeChangeRequestAvailable(_state)).toBeFalsy();
    });
});
