import { renderHook } from '@testing-library/react';

import apiMiddleware, { CALL_API } from './middleware';
import submitDataWithFetch from './submitDataWithFetch';
import submitFormDataWithFetch from './submitFormDataWithFetch';
import useWorkbookApi from './useWorkbookApi';

jest.mock('modules/routes', () => ({ usePathBase: () => '/ohd/en' }));

describe('API write authenticity', () => {
    const originalFetch = window.fetch;
    let headers;

    beforeEach(() => {
        document.head.innerHTML =
            '<meta name="csrf-token" content="page-token">';
        headers = [];
        window.fetch = jest.fn(async (_path, options) => {
            headers.push({ ...options.headers });
            return { json: async () => ({ success: true }) };
        });
    });

    afterEach(() => {
        document.head.innerHTML = '';
        window.fetch = originalFetch;
    });

    test.each([undefined, 1])(
        'JSON submissions send the current token (id: %s)',
        async (id) => {
            await submitDataWithFetch('/ohd/en', {
                person: { id, first_name: 'Jane' },
            });

            expect(headers[0]['X-CSRF-Token']).toBe('page-token');
            expect(headers[0]['Content-Type']).toBe('application/json');
        }
    );

    test.each([undefined, 1])(
        'uploads send the token without overriding the boundary (id: %s)',
        async (id) => {
            const file = new File(['content'], 'document.pdf', {
                type: 'application/pdf',
            });
            await submitFormDataWithFetch('/ohd/en', {
                material: { id, data: file },
            });

            expect(headers[0]['X-CSRF-Token']).toBe('page-token');
            expect(headers[0]).not.toHaveProperty('Content-Type');
            expect(
                window.fetch.mock.calls[0][1].body.get('material[data]')
            ).toBe(file);
        }
    );

    test('hook writes read the current token on every request', async () => {
        const { result } = renderHook(() => useWorkbookApi());
        await result.current.createWorkbookItem({ title: 'Bookmark' });
        document.querySelector('meta[name="csrf-token"]').content =
            'updated-token';
        await result.current.updateWorkbookItem(1, { title: 'Updated' });
        await result.current.deleteWorkbookItem(1);

        expect(headers.map((header) => header['X-CSRF-Token'])).toEqual([
            'page-token',
            'updated-token',
            'updated-token',
        ]);
    });

    test('Redux API writes include the token and preserve success dispatch', async () => {
        const next = jest.fn();
        await apiMiddleware({})(next)({
            [CALL_API]: {
                endpoint: '/ohd/en/people',
                method: 'POST',
                body: { person: { first_name: 'Jane' } },
                types: ['START', 'SUCCESS', 'FAILURE'],
            },
        });

        expect(headers[0]['X-CSRF-Token']).toBe('page-token');
        expect(next).toHaveBeenLastCalledWith({
            type: 'SUCCESS',
            payload: { success: true },
        });
    });
});
