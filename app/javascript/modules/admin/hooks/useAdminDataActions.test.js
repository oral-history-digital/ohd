import { act, renderHook } from '@testing-library/react';
import {
    deleteData as deleteDataAction,
    fetchData as fetchDataAction,
    submitData as submitDataAction,
} from 'modules/data';
import { setQueryParams as setQueryParamsAction } from 'modules/search';
import { useDispatch } from 'react-redux';

import useAdminDataActions from './useAdminDataActions';

jest.mock('modules/data', () => ({
    deleteData: jest.fn((...args) => ({ type: 'deleteData', args })),
    fetchData: jest.fn((...args) => ({ type: 'fetchData', args })),
    submitData: jest.fn((...args) => ({ type: 'submitData', args })),
}));
jest.mock('modules/search', () => ({
    setQueryParams: jest.fn((...args) => ({ type: 'setQueryParams', args })),
}));
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));

const dispatch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
});

test('dispatches admin data actions with their arguments', () => {
    const { result } = renderHook(() => useAdminDataActions());

    act(() => {
        result.current.fetchData('context', 'collections');
        result.current.deleteData('context', 'collections', 1);
        result.current.submitData('context', { id: 1 });
        result.current.setQueryParams('collections', { page: 2 });
    });

    expect(fetchDataAction).toHaveBeenCalledWith('context', 'collections');
    expect(deleteDataAction).toHaveBeenCalledWith('context', 'collections', 1);
    expect(submitDataAction).toHaveBeenCalledWith('context', { id: 1 });
    expect(setQueryParamsAction).toHaveBeenCalledWith('collections', {
        page: 2,
    });
    expect(dispatch.mock.calls).toEqual([
        [{ type: 'fetchData', args: ['context', 'collections'] }],
        [{ type: 'deleteData', args: ['context', 'collections', 1] }],
        [{ type: 'submitData', args: ['context', { id: 1 }] }],
        [
            {
                type: 'setQueryParams',
                args: ['collections', { page: 2 }],
            },
        ],
    ]);
});
