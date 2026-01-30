import { createElement } from 'react';

import t from './t';

// The project's runtime i18n stores translations keyed by translation key,
// with per-locale strings: { key: { de: '...', en: '...' } }
const translations = {
    warning: {
        de: 'Achtung!',
        en: 'Beware!',
    },
    greeting: {
        de: 'Hallo %{name}!',
        en: 'Hello %{name}!',
    },
    columnHeader: {
        de: 'Name (%{locale})',
        en: 'Name (%{locale})',
    },
    default: {
        missingKey: {
            de: 'Default Missing Key',
            en: 'Default Missing Key',
        },
    },
};

describe('t() function', () => {
    const baseProps = {
        translations,
        translationsView: false,
    };

    it('translates into one language', () => {
        const props = { ...baseProps, locale: 'de' };
        const actual = t(props, 'warning');
        const expected = 'Achtung!';
        expect(actual).toBe(expected);
    });

    it('translates into another language', () => {
        const props = { ...baseProps, locale: 'en' };
        const actual = t(props, 'warning');
        const expected = 'Beware!';
        expect(actual).toBe(expected);
    });

    describe('parameter substitution', () => {
        it('returns an array when substituting any parameters (string or React)', () => {
            const props = { ...baseProps, locale: 'en' };
            const actual = t(props, 'greeting', { name: 'Alice' });
            // reactStringReplace always returns an array when parameters are substituted
            expect(Array.isArray(actual)).toBe(true);
            expect(actual).toEqual(['Hello ', 'Alice', '!']);
        });

        it('returns an array when substituting multiple string parameters', () => {
            const props = { ...baseProps, locale: 'en' };
            const actual = t(props, 'columnHeader', { locale: 'en' });
            expect(Array.isArray(actual)).toBe(true);
            expect(actual).toEqual(['Name (', 'en', ')']);
        });

        it('returns an array with React elements interleaved', () => {
            const props = { ...baseProps, locale: 'en' };
            const element = createElement('strong', null, 'Bob');
            const actual = t(props, 'greeting', { name: element });
            // reactStringReplace returns an array of interleaved strings and elements
            expect(Array.isArray(actual)).toBe(true);
            expect(actual[0]).toBe('Hello ');
            expect(actual[1]).toEqual(element);
            expect(actual[2]).toBe('!');
        });
    });

    describe('fallback chain', () => {
        it('returns production fallback (key name) when translation missing', () => {
            const props = { ...baseProps, locale: 'en' };
            const actual = t(props, 'nonexistent.key');
            // Should return the last part of the key
            expect(actual).toBe('key');
        });

        it('returns last key part when no default key exists in translations', () => {
            const props = { ...baseProps, locale: 'en' };
            // deeply.nested.missingKey: tries deeply.nested.missingKey, then deeply.default.missingKey,
            // then falls back to 'missingKey'
            const actual = t(props, 'deeply.nested.missingKey');
            expect(actual).toBe('missingKey');
        });
    });

    describe('translationsView mode', () => {
        it('appends translation key for debugging when translationsView is true', () => {
            const props = {
                ...baseProps,
                locale: 'en',
                translationsView: true,
            };
            const actual = t(props, 'warning');
            expect(actual).toBe('Beware! (warning)');
        });

        it('appends key to array results in translationsView mode', () => {
            const props = {
                ...baseProps,
                locale: 'en',
                translationsView: true,
            };
            const element = createElement('strong', null, 'Bob');
            const actual = t(props, 'greeting', { name: element });
            expect(Array.isArray(actual)).toBe(true);
            expect(actual[actual.length - 1]).toBe(' (greeting)');
        });
    });
});
