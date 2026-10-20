/* eslint-disable react/prop-types */
import { act, renderHook } from '@testing-library/react';
import { Loader } from 'modules/api';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import { dataReducer } from '../../data/redux/reducer';
import { LOGOUT } from '../action-types';
import userReducer from '../reducer';
import useFetchAccount from './useFetchAccount';

jest.mock('modules/api', () => ({
    Loader: { getJson: jest.fn(), delete: jest.fn() },
}));
jest.mock('modules/data', () => ({
    ...jest.requireActual('../../data/redux/actions'),
    getCurrentUser: (state) => state.data.users.current,
    getUsersStatus: (state) => state.data.statuses.users,
}));
jest.mock('modules/routes', () => ({
    usePathBase: jest.requireActual('../../routes/usePathBase').default,
    pathBase: jest.requireActual('../../routes/pathBase').default,
}));

/**
 * Mounts account loading with a signed-in session and no cached project records.
 *
 * @param {string} [path='/pilot/de/users/account'] - Current browser route.
 * @returns {import('redux').Store} Store receiving real request and account actions.
 */
function mount(path = '/pilot/de/users/account') {
    const store = createStore(
        combineReducers({ data: dataReducer, user: userReducer }),
        {
            data: dataReducer(undefined, {}),
            user: { isLoggedIn: true, isLoggedOut: false },
        },
        applyMiddleware(thunk)
    );
    renderHook(() => useFetchAccount(), {
        wrapper: ({ children }) => (
            <Provider store={store}>
                <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
            </Provider>
        ),
    });
    return store;
}

/** Completes the pending current-account request without loading any project data. */
function completeAccount() {
    const [, , dispatch, success] = Loader.getJson.mock.lastCall;
    dispatch(success({ data_type: 'users', id: 'current', data: { id: 2 } }));
}

beforeEach(() => jest.clearAllMocks());

test.each([
    ['/pilot/de/users/account', '/pilot/de'],
    ['/en/users/account', '/en'],
])(
    'loads the account on %s without waiting for project details',
    (path, pathBase) => {
        const store = mount(path);
        expect(Loader.getJson.mock.lastCall[0]).toBe(
            `${pathBase}/users/current.json`
        );
        act(() => completeAccount());
        expect(store.getState().data.users.current).toEqual({ id: 2 });
        expect(store.getState().data.projects).toEqual({});
        expect(Loader.getJson).toHaveBeenCalledTimes(1);
    }
);

test.each(['before', 'after'])(
    'logout %s the account response clears local data without a DELETE request',
    (timing) => {
        const store = mount();
        if (timing === 'after') act(() => completeAccount());
        act(() => store.dispatch({ type: LOGOUT }));
        if (timing === 'before') act(() => completeAccount());
        expect(store.getState().data.users.current).toBeFalsy();
        expect(Loader.delete).not.toHaveBeenCalled();
        expect(Loader.getJson).toHaveBeenCalledTimes(1);
    }
);
