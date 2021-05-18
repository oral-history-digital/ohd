import reducer, { initialState } from './reducer';
import * as types from './action-types';
import { MAP_NUM_INITIALLY_SELECTED_TYPES } from './constants';

const state = {
    map: {
        facets: null,
        query: {},
        foundMarkers: null,
        referenceTypes: null,
        filter: null,
    },
    isMapSearching: false,
};

test('returns the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
});

test('handles the RECEIVE_MAP_SEARCH action', () => {
    const _state = {
        ...state,
        isMapSearching: true,
    };
    const action = {
        type: types.RECEIVE_MAP_SEARCH,
        payload: [
            {
                id: 1,
                name: 'London',
                lat: '34.2',
                lon: '67.2',
                ref_types: '1,2,3',
            },
        ],
    };
    const expectedState = {
        ...state,
        map: {
            ...state.map,
            foundMarkers: [
                {
                    id: 1,
                    name: 'London',
                    lat: '34.2',
                    lon: '67.2',
                    ref_types: '1,2,3',
                },
            ],
        },
    };
    expect(reducer(_state, action)).toEqual(expectedState);
});

test('handles the RECEIVE_MAP_REFERENCE_TYPES action', () => {
    const action = {
        type: types.RECEIVE_MAP_REFERENCE_TYPES,
        payload: [
            {
                id: 1,
                name: 'Habitation',
            },
            {
                id: 2,
                name: 'Birthplace',
            },
            {
                id: 3,
                name: 'Habitation after 1945',
            },
            {
                id: 4,
                name: 'Companies',
            },
        ],
    };
    const expectedState = {
        ...state,
        map: {
            ...state.map,
            referenceTypes: [
                {
                    id: 1,
                    name: 'Habitation',
                },
                {
                    id: 2,
                    name: 'Birthplace',
                },
                {
                    id: 3,
                    name: 'Habitation after 1945',
                },
                {
                    id: 4,
                    name: 'Companies',
                },
            ],
            filter: [1, 2, 3, 4].slice(0, MAP_NUM_INITIALLY_SELECTED_TYPES),
        },
    };
    expect(reducer(state, action)).toEqual(expectedState);
});

test('handles the TOGGLE_MAP_FILTER action', () => {
    const _state = {
        ...state,
        map: {
            ...state.map,
            filter: [3, 4, 5],
        },
    };
    const action = {
        type: types.TOGGLE_MAP_FILTER,
        payload: 3,
    };
    const expectedState = {
        ...state,
        map: {
            ...state.map,
            filter: [4, 5],
        },
    };
    expect(reducer(_state, action)).toEqual(expectedState);
});
