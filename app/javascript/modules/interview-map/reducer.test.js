import reducer, { initialState } from './reducer';
import { FETCH_LOCATIONS_STARTED, FETCH_LOCATIONS_SUCCEEDED, FETCH_LOCATIONS_FAILED }
    from './action-types';

const state = {
    isLoading: false,
    error: 'previous error',
};

test('returns the initial state', () => {
    expect(reducer(undefined, initialState)).toEqual(initialState);
});

test('handles the fetch started action', () => {
    const action = { type: FETCH_LOCATIONS_STARTED };
    const expectedState = {
        ...state,
        isLoading: true,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the fetch succeeded action', () => {
    const action = {
        type: FETCH_LOCATIONS_SUCCEEDED,
        payload: {
            archive_id: 'za001',
            segment_ref_locations: [
                {
                    id: 78061,
                    type: 'RegistryReference',
                },
            ],
        }
    };
    const expectedState = {
        ...state,
        isLoading: false,
        error: null,
        za001: action.payload.segment_ref_locations,
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the fetch failed action', () => {
    const action = {
        type: FETCH_LOCATIONS_FAILED,
        error: 'not found',
    };
    const expectedState = {
        ...state,
        isLoading: false,
        error: 'not found',
    };
    expect(reducer(state, action)).toEqual(expectedState);
});
