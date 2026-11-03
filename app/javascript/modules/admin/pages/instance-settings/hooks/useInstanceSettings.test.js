import { act, renderHook } from '@testing-library/react';

import useInstanceSettings from './useInstanceSettings';

jest.mock('modules/routes', () => ({ usePathBase: () => '/ohd/en' }));
jest.mock('modules/data', () => ({ replaceInstanceSettings: jest.fn() }));
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));
jest.mock('swr', () => ({
    __esModule: true,
    default: () => ({ mutate: jest.fn() }),
}));

test('settings and logo writes include CSRF headers without overriding multipart boundaries', async () => {
    const originalFetch = window.fetch;
    document.head.innerHTML = '<meta name="csrf-token" content="page-token">';
    window.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ data: { name: 'Updated' } }),
    });

    try {
        const { result } = renderHook(() => useInstanceSettings());
        await act(async () => {
            await result.current.updateInstanceSettings({
                instance_setting: { name: 'Updated' },
            });
            await result.current.updateBreadcrumbLogo(
                'light',
                new File(['logo'], 'logo.png')
            );
            await result.current.removeBreadcrumbLogo('light');
        });

        expect(window.fetch).toHaveBeenCalledTimes(3);
        for (const [, options] of window.fetch.mock.calls) {
            expect(options.headers['X-CSRF-Token']).toBe('page-token');
            expect(options.headers).not.toHaveProperty('Content-Type');
        }
    } finally {
        window.fetch = originalFetch;
        document.head.innerHTML = '';
    }
});
