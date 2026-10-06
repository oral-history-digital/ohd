import { act, renderHook, waitFor } from '@testing-library/react';
import { receiveData } from 'modules/data';
import { useDispatch } from 'react-redux';
import { SWRConfig } from 'swr';

import { useCancelEmailChange } from './useCancelEmailChange';

jest.mock('modules/data', () => ({
    receiveData: jest.fn((payload) => ({ type: 'RECEIVE_DATA', payload })),
}));
jest.mock('react-redux', () => ({ useDispatch: jest.fn() }));
jest.mock('modules/routes', () => ({ usePathBase: () => '/archive/es' }));

describe('useCancelEmailChange', () => {
    const originalFetch = window.fetch;
    const payload = {
        id: 'current',
        data_type: 'users',
        data: { unconfirmed_email: null },
    };
    let cache;
    let dispatch;

    function SwrWrapper(props) {
        return <SWRConfig {...props} value={{ provider: () => cache }} />;
    }

    beforeEach(() => {
        cache = new Map();
        dispatch = jest.fn();
        useDispatch.mockReturnValue(dispatch);
        window.fetch = jest.fn();
    });

    afterEach(() => {
        window.fetch = originalFetch;
        jest.clearAllMocks();
    });

    it('replaces the current user in SWR and Redux after cancellation', async () => {
        cache.set('/archive/es/users/current.json', {
            data: {
                ...payload,
                data: { unconfirmed_email: 'pending@example.com' },
            },
        });
        window.fetch.mockResolvedValue({ ok: true, json: async () => payload });
        const { result } = renderHook(() => useCancelEmailChange(), {
            wrapper: SwrWrapper,
        });
        await act(async () => {
            await result.current.cancelEmailChange();
        });

        expect(window.fetch).toHaveBeenCalledWith(
            '/archive/es/users/current/cancel_email_change.json',
            expect.objectContaining({
                method: 'DELETE',
                credentials: 'same-origin',
            })
        );
        expect(cache.get('/archive/es/users/current.json').data).toEqual(
            payload
        );
        expect(receiveData).toHaveBeenCalledWith(payload);
        expect(dispatch).toHaveBeenCalledWith({
            type: 'RECEIVE_DATA',
            payload,
        });
        expect(result.current.isCancelling).toBe(false);
    });

    it('preserves both stores on failure and supports retry', async () => {
        const pending = {
            ...payload,
            data: { unconfirmed_email: 'pending@example.com' },
        };
        cache.set('/archive/es/users/current.json', { data: pending });
        window.fetch.mockResolvedValueOnce({ ok: false });
        const { result } = renderHook(() => useCancelEmailChange(), {
            wrapper: SwrWrapper,
        });
        await act(async () => {
            await expect(result.current.cancelEmailChange()).rejects.toThrow(
                'Email change cancellation failed'
            );
        });
        expect(result.current.error).toBeTruthy();
        expect(result.current.isCancelling).toBe(false);
        expect(cache.get('/archive/es/users/current.json').data).toEqual(
            pending
        );
        expect(dispatch).not.toHaveBeenCalled();

        window.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => payload,
        });
        await act(async () => {
            await result.current.cancelEmailChange();
        });
        await waitFor(() => expect(result.current.error).toBeUndefined());
        expect(cache.get('/archive/es/users/current.json').data).toEqual(
            payload
        );
        expect(dispatch).toHaveBeenCalledTimes(1);
    });
});
