import '../../__mocks__/matchMediaMock';
import * as types from './action-types';
import * as actions from './actions';

test('setAvailableViewModes', () => {
    const actual = actions.setAvailableViewModes(['grid', 'list']);
    const expected = {
        type: types.SET_AVAILABLE_VIEW_MODES,
        payload: ['grid', 'list'],
    };
    expect(actual).toEqual(expected);
});

test('setViewMode', () => {
    const actual = actions.setViewMode('grid');
    const expected = {
        type: types.SET_VIEW_MODE,
        payload: 'grid',
    };
    expect(actual).toEqual(expected);
});

test('clearViewModes', () => {
    const actual = actions.clearViewModes();
    const expected = { type: types.CLEAR_VIEW_MODES };
    expect(actual).toEqual(expected);
});
