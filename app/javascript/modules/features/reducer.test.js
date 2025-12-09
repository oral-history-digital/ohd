import * as actions from './actions';
import reducer, { initialState } from './reducer';

const state = {
    dummy: false,
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the enable action', () => {
    const action = actions.enable('dummy');
    const expectedState = {
        ...state,
        dummy: true,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the disable action', () => {
    const action = actions.disable('dummy');
    const _state = {
        ...state,
        dummy: true,
    };
    const expectedState = {
        ...state,
        dummy: false,
    };
    expect(reducer(_state, action)).toEqual(expectedState);
});
