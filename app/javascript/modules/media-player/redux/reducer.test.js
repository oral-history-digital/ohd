import * as actions from './actions';
import reducer, { initialState } from './reducer';

const state = {
    tape: 1,
    mediaTime: 0,
    isPlaying: false,
    timeChangeRequest: null,
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

test('handles the updateMediaTime action', () => {
    const action = actions.updateMediaTime(12.3);
    const expectedState = {
        ...state,
        mediaTime: 12.3,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the updateIsPlaying action', () => {
    const action = actions.updateIsPlaying(true);
    const expectedState = {
        ...state,
        isPlaying: true,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the resetMedia action', () => {
    const action = actions.resetMedia();
    const _state = {
        ...state,
        tape: 3,
        mediaTime: 25.4,
        isPlaying: true,
    };
    const expectedState = initialState;
    expect(reducer(_state, action)).toEqual(expectedState);
});

test('handles the sendTimeChangeRequest action', () => {
    const action = actions.sendTimeChangeRequest(2, 55.2);
    const expectedState = {
        ...state,
        tape: 2,
        timeChangeRequest: 55.2,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the clearTimeChangeRequest action', () => {
    const action = actions.clearTimeChangeRequest();
    const _state = {
        ...state,
        timeChangeRequest: 22.3,
    };
    const expectedState = state;
    expect(reducer(_state, action)).toEqual(expectedState);
});
