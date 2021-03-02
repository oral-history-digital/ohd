import * as types from './action-types';
import * as actions from './actions';

test('enable', () => {
    const actual = actions.enable('dummy');
    const expected = {
        type: types.ENABLE,
        payload: { name: 'dummy' },
    };
    expect(actual).toEqual(expected);
});

test('disable', () => {
    const actual = actions.disable('dummy');
    const expected = {
        type: types.DISABLE,
        payload: { name: 'dummy' },
    };
    expect(actual).toEqual(expected);
});
