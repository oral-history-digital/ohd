import { normalizeRegisterErrorMessage } from './normalizeRegisterErrorMessage';

describe('normalizeRegisterErrorMessage', () => {
    const translate = (key) => `translated:${key}`;

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
        expect(normalizeRegisterErrorMessage({ error: '' }, translate)).toBe(
            'translated:modules.registration.messages.generic_registration_error'
        );
    });

    it('falls back when errors array is empty', () => {
        expect(normalizeRegisterErrorMessage({ errors: [] }, translate)).toBe(
            'translated:modules.registration.messages.generic_registration_error'
        );
    });

    it('falls back when errors object has no truthy messages', () => {
        expect(
            normalizeRegisterErrorMessage(
                {
                    errors: {
                        email: ['', null],
                        password: [undefined, false],
                    },
                },
                translate
            )
        ).toBe(
            'translated:modules.registration.messages.generic_registration_error'
        );
    });

    it('falls back when json is nullish or empty', () => {
        expect(normalizeRegisterErrorMessage(undefined, translate)).toBe(
            'translated:modules.registration.messages.generic_registration_error'
        );
        expect(normalizeRegisterErrorMessage(null, translate)).toBe(
            'translated:modules.registration.messages.generic_registration_error'
        );
        expect(normalizeRegisterErrorMessage({}, translate)).toBe(
            'translated:modules.registration.messages.generic_registration_error'
        );
    });

    it('falls back to key when no translator is provided', () => {
        expect(normalizeRegisterErrorMessage()).toBe(
            'modules.registration.messages.generic_registration_error'
        );
    });
});
