import reducer, { initialState } from './reducer';
import * as actions from './actions';

const state = {
    visible: false,
    index: 1,
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the show action', () => {
    const action = actions.showFlyoutTabs();
    const expectedState = {
        ...state,
        visible: true,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the hide action', () => {
    const action = actions.hideFlyoutTabs();
    const _state = {
        ...state,
        visible: true,
    };
    const expectedState = {
        ...state,
        visible: false,
    };
    expect(reducer(_state, action)).toEqual(expectedState);
});

describe('toggle action', () => {
    test('shows if hidden', () => {
        const action = actions.toggleFlyoutTabs();
        const expectedState = {
            ...state,
            visible: true,
        };
        expect(reducer(state, action)).toEqual(expectedState);
    });

    test('hides if shown', () => {
        const action = actions.toggleFlyoutTabs();
        const _state = {
            ...state,
            visible: true,
        };
        const expectedState = {
            ...state,
            visible: false,
        };
        expect(reducer(_state, action)).toEqual(expectedState);
    });
});

test('handles the set index action', () => {
    const action = actions.setFlyoutTabsIndex(5);
    const expectedState = {
        ...state,
        index: 5,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
