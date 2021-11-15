import * as types from './action-types';
import * as actions from './actions';

test('setMapQuery', () => {
    const actual = actions.setMapQuery({
        'forced_labor_group[]': ['28218'],
    });
    const expected = {
        type: types.SET_MAP_QUERY,
        payload: {
            'forced_labor_group[]': ['28218'],
        },
    };
    expect(actual).toEqual(expected);
});

test('clearSingleInterviewSearch', () => {
    const actual = actions.clearSingleInterviewSearch('cd008');
    const expected = {
        type: types.CLEAR_SINGLE_INTERVIEW_SEARCH,
        payload: 'cd008',
    };
    expect(actual).toEqual(expected);
});

test('clearAllInterviewSearch', () => {
    const actual = actions.clearAllInterviewSearch();
    const expected = { type: types.CLEAR_ALL_INTERVIEW_SEARCH };
    expect(actual).toEqual(expected);
});
