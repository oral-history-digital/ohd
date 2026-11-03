import request from 'superagent';

import '../../__mocks__/matchMediaMock';
import * as types from './action-types';
import * as actions from './actions';

jest.mock('superagent', () => ({ post: jest.fn() }));

test.each(['batch', 'doi'])(
    '%s archive writes send the CSRF token',
    (action) => {
        const req = {
            send: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis(),
            then: jest.fn(),
        };
        request.post.mockReturnValue(req);
        document.head.insertAdjacentHTML(
            'beforeend',
            '<meta name="csrf-token" content="page-token">'
        );

        try {
            const thunk =
                action === 'batch'
                    ? actions.submitSelectedArchiveIds(
                          ['archive-id'],
                          'mark_texts',
                          '/ohd/en'
                      )
                    : actions.registerDoi(
                          '/ohd/en',
                          'interviews',
                          'archive-id'
                      );
            thunk(jest.fn());

            expect(req.set).toHaveBeenCalledWith('X-CSRF-Token', 'page-token');
        } finally {
            document.querySelector('meta[name="csrf-token"]').remove();
        }
    }
);

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
