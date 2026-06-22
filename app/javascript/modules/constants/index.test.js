import { EMAIL_REGEX, PASSWORD_REGEX } from './index';

describe('EMAIL_REGEX', () => {
    test('rejects invalid email addresses', () => {
        expect(EMAIL_REGEX.test('')).toBe(false);
        expect(EMAIL_REGEX.test('plainaddress')).toBe(false);
        expect(EMAIL_REGEX.test('@missingusername.com')).toBe(false);
        expect(EMAIL_REGEX.test('username@.com')).toBe(false);
        expect(EMAIL_REGEX.test('username@domain')).toBe(false);
        expect(EMAIL_REGEX.test('username@domain..com')).toBe(false);
        expect(EMAIL_REGEX.test('spaces in name@domain.com')).toBe(false);
    });

    test('accepts valid email addresses', () => {
        expect(EMAIL_REGEX.test('username@domain.com')).toBe(true);
        expect(EMAIL_REGEX.test('user.name+tag@example.de')).toBe(true);
        expect(EMAIL_REGEX.test('user_name@example.co.uk')).toBe(true);
    });
});

describe('PASSWORD_REGEX', () => {
    test('accepts password with one of the allowed special signs', () => {
        const specialSigns = '#?!@$%^&*+=_,.:;~-.';
        for (const sign of specialSigns) {
            expect(PASSWORD_REGEX.test(`Abcdef1${sign}`)).toBe(true);
        }
    });

    test('requires uppercase, lowercase, number and special sign', () => {
        expect(PASSWORD_REGEX.test('alllowercase1!')).toBe(false);
        expect(PASSWORD_REGEX.test('ALLUPPERCASE1!')).toBe(false);
        expect(PASSWORD_REGEX.test('NoNumber!')).toBe(false);
        expect(PASSWORD_REGEX.test('NoSpecial1')).toBe(false);
        expect(PASSWORD_REGEX.test('Short1!')).toBe(false);
        expect(PASSWORD_REGEX.test('ValidPassword1!')).toBe(true);
    });
});

describe('OHD domain constants', () => {
    const originalRailsMode = globalThis.railsMode;
    const originalOhdDomain = globalThis.ohdDomain;
    const originalOhdDomains = globalThis.ohdDomains;

    afterEach(() => {
        jest.resetModules();
        globalThis.railsMode = originalRailsMode;
        globalThis.ohdDomain = originalOhdDomain;
        globalThis.ohdDomains = originalOhdDomains;
    });

    test('returns undefined domain values when backend globals are missing', async () => {
        globalThis.railsMode = 'development';
        delete globalThis.ohdDomain;
        delete globalThis.ohdDomains;

        const { OHD_LOCATION, OHD_DOMAINS } = await import('./index');

        expect(OHD_LOCATION).toBeUndefined();
        expect(OHD_DOMAINS).toEqual({});
    });

    test('prefers backend-injected domain values when available', async () => {
        globalThis.railsMode = 'staging';
        globalThis.ohdDomain = 'https://portal.from-backend.example';
        globalThis.ohdDomains = {
            staging: 'https://staging.from-backend.example',
        };

        const { OHD_LOCATION, OHD_DOMAINS } = await import('./index');

        expect(OHD_LOCATION).toBe('https://portal.from-backend.example');
        expect(OHD_DOMAINS.staging).toBe(
            'https://staging.from-backend.example'
        );
    });
});
