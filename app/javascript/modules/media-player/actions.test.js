import * as types from './action-types';
import * as actions from './actions';

test('setTape', () => {
    const actual = actions.setTape(3);
    const expected = {
        type: types.SET_TAPE,
        payload: { tape: 3 },
    };
    expect(actual).toEqual(expected);
});

test('setResolution', () => {
    const actual = actions.setResolution('192k');
    const expected = {
        type: types.SET_RESOLUTION,
        payload: { resolution: '192k' },
    };
    expect(actual).toEqual(expected);
});

test('updateMediaTime', () => {
    const actual = actions.updateMediaTime(25.3);
    const expected = {
        type: types.UPDATE_MEDIA_TIME,
        payload: { time: 25.3 },
    };
    expect(actual).toEqual(expected);
});

test('updateIsPlaying', () => {
    const actual = actions.updateIsPlaying(true);
    const expected = {
        type: types.UPDATE_IS_PLAYING,
        payload: { isPlaying: true },
    };
    expect(actual).toEqual(expected);
});

test('resetMedia', () => {
    const actual = actions.resetMedia();
    const expected = { type: types.RESET_MEDIA };
    expect(actual).toEqual(expected);
});
