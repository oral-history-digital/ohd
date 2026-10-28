import { create, get } from '@github/webauthn-json';

import PasskeyController from './passkey_controller';

jest.mock('@github/webauthn-json', () => ({
    create: jest.fn(),
    get: jest.fn(),
}));

describe('passkey request authenticity', () => {
    const originalFetch = window.fetch;
    const originalCredential = window.PublicKeyCredential;

    beforeEach(() => {
        document.head.innerHTML =
            '<meta name="csrf-token" content="page-token">';
        document.body.innerHTML =
            '<div class="notification-container"></div><div id="passkeys"></div><div id="success" hidden></div>';
        window.PublicKeyCredential = jest.fn();
        create.mockResolvedValue({ id: 'credential' });
        get.mockResolvedValue({ id: 'credential' });
        window.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });
    });

    afterEach(() => {
        document.head.innerHTML = '';
        document.body.innerHTML = '';
        window.fetch = originalFetch;
        window.PublicKeyCredential = originalCredential;
    });

    test('registration verification sends the token as an HTTP header', async () => {
        await PasskeyController.prototype.register.call(
            { nicknameTarget: { value: 'My key' } },
            { preventDefault: jest.fn() }
        );

        expect(window.fetch).toHaveBeenCalledWith(
            '/de/passkeys',
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': 'page-token',
                },
            })
        );
        expect(document.getElementById('success').hidden).toBe(false);
    });

    test('both authentication POSTs send the token as an HTTP header', async () => {
        await PasskeyController.prototype.authenticate.call(
            {
                hasEmailTarget: true,
                emailTarget: { value: 'jane@example.com' },
            },
            { preventDefault: jest.fn() }
        );

        expect(window.fetch).toHaveBeenCalledTimes(2);
        for (const [, options] of window.fetch.mock.calls) {
            expect(options.headers['X-CSRF-Token']).toBe('page-token');
        }
    });
});
