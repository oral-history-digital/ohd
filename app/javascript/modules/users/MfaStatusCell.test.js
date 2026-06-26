import { renderToStaticMarkup } from 'react-dom/server';

import MfaStatusCell from './MfaStatusCell';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: 'en',
        t: (key) =>
            ({
                disabled: 'inactive',
                enabled: 'active',
                'user.mfa_otp': 'Authentication app',
                'user.mfa_passkey': 'Passkey',
            })[key] || key,
    }),
}));

describe('<MfaStatusCell />', () => {
    it('renders nothing when no MFA method is active', () => {
        const html = renderToStaticMarkup(
            <MfaStatusCell
                row={{
                    original: {
                        otp_required_for_login: false,
                        passkey_required_for_login: false,
                    },
                }}
            />
        );

        expect(html).toBe('');
    });

    it('renders a tooltip with both MFA method statuses', () => {
        const html = renderToStaticMarkup(
            <MfaStatusCell
                row={{
                    original: {
                        otp_required_for_login: true,
                        changed_to_otp_at: '2026-06-01',
                        passkey_required_for_login: false,
                    },
                }}
            />
        );

        expect(html).toContain('Authentication app: active');
        expect(html).toContain('Passkey: inactive');
    });
});
