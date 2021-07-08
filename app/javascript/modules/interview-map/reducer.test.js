import reducer, { initialState } from './reducer';
import { FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED }
    from './action-types';

test('returns the initial state', () => {
    expect(reducer(undefined, initialState)).toEqual(initialState);
});

test('handles the fetch started action', () => {
    const action = { type: FETCH_LOCATIONS_STARTED };
    const expectedState = {
        ...initialState,
        isLoading: true,
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
});

test('handles the fetch succeeded action', () => {
    const action = {
        type: FETCH_LOCATIONS_SUCCEEDED,
        payload: [
            {
                id: 6,
                lat: '51.6',
                lon: '31.2',
            },
        ],
    };
    const state = {
        ...initialState,
        isLoading: true,
    };
    const expectedState = {
        ...state,
        locations: action.payload,
        isLoading: false,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the fetch failed action', () => {
    const action = {
        type: FETCH_LOCATIONS_FAILED,
        error: 'not found',
    };
    const state = {
        ...initialState,
        isLoading: true,
    };
    const expectedState = {
        ...state,
        isLoading: false,
        error: 'not found',
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
