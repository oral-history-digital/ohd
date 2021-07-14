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
