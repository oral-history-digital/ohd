import reducer, { initialState } from './reducer';
import * as actions from './actions';

const state = {
    transcriptScrollEnabled: false,
    tabIndex: 0,
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the setInterviewTabIndex action', () => {
    const action = actions.setInterviewTabIndex(2);
    const expectedState = {
        ...state,
        tabIndex: 2,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

describe('handleTranscriptScroll', () => {
    test('is enabled', () => {
        const action = actions.handleTranscriptScroll(true);
        const expectedState = {
            ...state,
            transcriptScrollEnabled: true,
        };
        expect(reducer(state, action)).toEqual(expectedState);
    });

    test('is disabled', () => {
        const action = actions.handleTranscriptScroll(false);
        const _state = {
            ...state,
            transcriptScrollEnabled: true,
        };
        const expectedState = {
            ...state,
            transcriptScrollEnabled: false,
        };
        expect(reducer(_state, action)).toEqual(expectedState);
    });
});
