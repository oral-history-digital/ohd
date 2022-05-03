import * as types from './action-types';
import * as actions from './actions';

test('enableAutoScroll', () => {
    const actual = actions.enableAutoScroll();
    const expected = { type: types.ENABLE_AUTO_SCROLL };
    expect(actual).toEqual(expected);
});

test('disableAutoScroll', () => {
    const actual = actions.disableAutoScroll();
    const expected = { type: types.DISABLE_AUTO_SCROLL };
    expect(actual).toEqual(expected);
});
