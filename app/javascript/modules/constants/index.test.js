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
