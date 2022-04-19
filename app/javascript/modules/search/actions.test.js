import * as types from './action-types';
import * as actions from './actions';

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
