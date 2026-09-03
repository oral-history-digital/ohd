import { act, renderHook } from '@testing-library/react';
import { fetchData as fetchDataAction } from 'modules/data';
import {
    resetQuery as resetQueryAction,
    setQueryParams as setQueryParamsAction,
} from 'modules/search';
import { hideSidebar as hideSidebarAction } from 'modules/sidebar';
import { useDispatch, useSelector } from 'react-redux';

import useAdminSearch from './useAdminSearch';

jest.mock('modules/data', () => ({
    fetchData: jest.fn((...args) => ({ type: 'fetchData', args })),
}));
jest.mock('modules/search', () => ({
    resetQuery: jest.fn((...args) => ({ type: 'resetQuery', args })),
    setQueryParams: jest.fn((...args) => ({ type: 'setQueryParams', args })),
}));
jest.mock('modules/sidebar', () => ({
    hideSidebar: jest.fn(() => ({ type: 'hideSidebar' })),
}));
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

const dispatch = jest.fn();
const state = { search: { collections: { query: { name: 'history' } } } };

beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation((selector) => selector(state));
});

test('selects and returns the current query', () => {
    const querySelector = jest.fn(
        (currentState) => currentState.search.collections.query
    );

    const { result } = renderHook(() => useAdminSearch(querySelector));

    expect(querySelector).toHaveBeenCalledWith(state);
    expect(result.current.query).toEqual({ name: 'history' });
});

test('dispatches admin search actions with their arguments', () => {
    const { result } = renderHook(() => useAdminSearch(() => ({})));

    act(() => {
        result.current.fetchData('context', 'collections');
        result.current.setQueryParams('collections', { page: 2 });
        result.current.resetQuery('collections');
        result.current.hideSidebar();
    });

    expect(fetchDataAction).toHaveBeenCalledWith('context', 'collections');
    expect(setQueryParamsAction).toHaveBeenCalledWith('collections', {
        page: 2,
    });
    expect(resetQueryAction).toHaveBeenCalledWith('collections');
    expect(hideSidebarAction).toHaveBeenCalledWith();
    expect(dispatch.mock.calls).toEqual([
        [{ type: 'fetchData', args: ['context', 'collections'] }],
        [
            {
                type: 'setQueryParams',
                args: ['collections', { page: 2 }],
            },
        ],
        [{ type: 'resetQuery', args: ['collections'] }],
        [{ type: 'hideSidebar' }],
    ]);
});
