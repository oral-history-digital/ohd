import { normalizeRegisterErrorMessage } from './normalizeRegisterErrorMessage';

describe('normalizeRegisterErrorMessage', () => {
    it('returns json.error when it is a non-empty string', () => {
        expect(
            normalizeRegisterErrorMessage({
                error: 'Email has already been taken',
            })
        ).toBe('Email has already been taken');
    });

    it('returns joined string when json.errors is an array', () => {
        expect(
            normalizeRegisterErrorMessage({
                errors: ['Email is invalid', 'Password is too short'],
            })
        ).toBe('Email is invalid, Password is too short');
    });

    it('returns joined flattened messages when json.errors is an object', () => {
        expect(
            normalizeRegisterErrorMessage({
                errors: {
                    email: ['Email is invalid'],
                    password: ['Password is too short', 'Password is too weak'],
                },
            })
        ).toBe('Email is invalid, Password is too short, Password is too weak');
    });

    it('filters falsy values in object-based errors', () => {
        expect(
            normalizeRegisterErrorMessage({
                errors: {
                    email: ['', null, 'Email is invalid'],
                    password: [undefined, false, 'Password is too short'],
                },
            })
        ).toBe('Email is invalid, Password is too short');
    });

    it('falls back when json.error is an empty string', () => {
        expect(normalizeRegisterErrorMessage({ error: '' })).toBe(
            'devise.failure.invalid'
        );
    });

    it('falls back when errors array is empty', () => {
        expect(normalizeRegisterErrorMessage({ errors: [] })).toBe(
            'devise.failure.invalid'
        );
    });

    it('falls back when errors object has no truthy messages', () => {
        expect(
            normalizeRegisterErrorMessage({
                errors: {
                    email: ['', null],
                    password: [undefined, false],
                },
            })
        ).toBe('devise.failure.invalid');
    });

    it('falls back when json is nullish or empty', () => {
        expect(normalizeRegisterErrorMessage()).toBe('devise.failure.invalid');
        expect(normalizeRegisterErrorMessage(null)).toBe(
            'devise.failure.invalid'
        );
        expect(normalizeRegisterErrorMessage({})).toBe(
            'devise.failure.invalid'
        );
    });
});
