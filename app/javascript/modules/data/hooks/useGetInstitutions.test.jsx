/* eslint-disable react/prop-types */
import { act, renderHook } from '@testing-library/react';
import { Loader } from 'modules/api';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { dataReducer } from '../redux/reducer';
import { useGetInstitutions } from './useGetInstitutions';

jest.mock('modules/api', () => ({ Loader: { getJson: jest.fn() } }));
jest.mock('modules/routes', () => ({ usePathBase: () => '/za/en' }));
jest.mock('modules/data', () => ({
    fetchData: jest.requireActual('../redux/actions').fetchData,
    getInstitutions: (state) => state.data.institutions,
    getStatuses: (state) => state.data.statuses,
}));

beforeEach(() => jest.clearAllMocks());

/**
 * Mounts the institution reader with real Redux request and response handling.
 * @returns {Object} Store and hook controls for completing requests or enabling reads.
 */
function mount() {
    const store = createStore(
        (state = {}, action) => ({ data: dataReducer(state.data, action) }),
        applyMiddleware(thunk)
    );
    const hook = renderHook(({ enabled }) => useGetInstitutions({ enabled }), {
        initialProps: { enabled: false },
        wrapper: ({ children }) => (
            <Provider store={store}>{children}</Provider>
        ),
    });
    return { ...hook, store };
}

test('loads once after authorization and reuses the completed institution list', () => {
    const { result, rerender } = mount();
    expect(Loader.getJson).not.toHaveBeenCalled();
    rerender({ enabled: true });
    const [url, , dispatch, receive] = Loader.getJson.mock.lastCall;
    expect(url).toBe('/za/en/institutions.json?all');
    act(() =>
        dispatch(
            receive({
                data_type: 'institutions',
                extra_params: 'all',
                data: { 4: { id: 4, name: 'Institute' } },
            })
        )
    );
    expect(result.current[4].name).toBe('Institute');
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
});

test('records institution load failures without automatically retrying', () => {
    const { store, rerender } = mount();
    rerender({ enabled: true });
    const [, , dispatch, , receiveError] = Loader.getJson.mock.lastCall;
    act(() =>
        dispatch(receiveError({ status: 500, message: 'Unable to load' }))
    );
    expect(store.getState().data.statuses.institutions.all).toMatch(/^error-/);
    rerender({ enabled: true });
    expect(Loader.getJson).toHaveBeenCalledTimes(1);
});
