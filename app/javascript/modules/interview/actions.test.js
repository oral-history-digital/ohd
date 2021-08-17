import * as types from './action-types';
import * as actions from './actions';

test('setInterviewTabIndex', () => {
    const actual = actions.setInterviewTabIndex(1);
    const expected = {
        type: types.SET_INTERVIEW_TAB_INDEX,
        tabIndex: 1,
    };
    expect(actual).toEqual(expected);
});

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
