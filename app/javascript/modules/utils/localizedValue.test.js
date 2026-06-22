import localizedValue from './localizedValue';

describe('localizedValue', () => {
    it('returns emptyValue for null or undefined', () => {
        expect(localizedValue(null, 'de')).toBe(null);
        expect(localizedValue(undefined, 'de')).toBe(null);
        expect(localizedValue(null, 'de', { emptyValue: '' })).toBe('');
    });

    it('returns strings and numbers as strings', () => {
        expect(localizedValue('Text', 'de')).toBe('Text');
        expect(localizedValue(123, 'de')).toBe('123');
    });

    it('returns emptyValue for unsupported primitive values', () => {
        expect(localizedValue(true, 'de')).toBe(null);
        expect(localizedValue(false, 'de', { emptyValue: '' })).toBe('');
    });

    it('returns the value for the requested locale', () => {
        const value = {
            de: 'Deutsch',
            en: 'English',
        };

        expect(localizedValue(value, 'de')).toBe('Deutsch');
        expect(localizedValue(value, 'en')).toBe('English');
    });

    it('returns localized number values as strings', () => {
        const value = {
            de: 2024,
            en: 'English',
        };

        expect(localizedValue(value, 'de')).toBe('2024');
    });

    it('falls back to the configured fallback locales in order', () => {
        const value = {
            de: 'Deutsch',
            en: 'English',
        };

        expect(localizedValue(value, 'es')).toBe('Deutsch');
        expect(
            localizedValue(value, 'es', { fallbackLocales: ['en', 'de'] })
        ).toBe('English');
    });

    it('skips blank, null, and undefined localized values', () => {
        const value = {
            es: '',
            de: null,
            en: 'English',
        };

        expect(localizedValue(value, 'es')).toBe('English');
    });

    it('returns the first primitive value as a last-resort fallback', () => {
        const value = {
            es: '',
            ru: 'Русский',
            uk: 'Українська',
        };

        expect(localizedValue(value, 'de', { fallbackLocales: ['en'] })).toBe(
            'Русский'
        );
    });

    it('ignores non-primitive localized values', () => {
        const value = {
            de: { text: 'Deutsch' },
            en: ['English'],
            es: 'Español',
        };

        expect(localizedValue(value, 'de')).toBe('Español');
    });

    it('returns emptyValue when no usable value exists', () => {
        const value = {
            de: '',
            en: null,
            es: undefined,
            ru: {},
        };

        expect(localizedValue(value, 'uk')).toBe(null);
        expect(localizedValue(value, 'uk', { emptyValue: '' })).toBe('');
    });

    it('handles missing locale keys', () => {
        const value = {
            en: 'English',
        };

        expect(localizedValue(value)).toBe('English');
        expect(localizedValue(value, null)).toBe('English');
    });
});
