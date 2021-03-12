import reducer, { initialState } from './reducer';
import * as actions from './actions';

const state = {
    tape: 1,
    mediaTime: 0,
    mediaStatus: 'pause',
    transcriptTime: 0,
    resolution: null,
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the setTape action', () => {
    const action = actions.setTape(3);
    const expectedState = {
        ...state,
        tape: 3,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the setResolution action', () => {
    const action = actions.setResolution('480p');
    const expectedState = {
        ...state,
        resolution: '480p',
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the resetMedia action', () => {
    const action = actions.resetMedia();
    const _state = {
        tape: 3,
        mediaTime: 25.4,
        mediaStatus: 'play',
        transcriptTime: 5.2,
        resolution: '480p',
    };
    const expectedState = initialState;
    expect(reducer(_state, action)).toEqual(expectedState);
});
