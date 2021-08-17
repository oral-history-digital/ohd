import { PROJECT_ZWAR, PROJECT_CDOH, PROJECT_MOG } from 'modules/constants';
import showTranslationTab from './showTranslationTab';

describe('ZWAR', () => {
    test('is false if interview lang is German', () => {
        const actual = showTranslationTab(PROJECT_ZWAR, 'de', 'en');
        const expected = false;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const actual = showTranslationTab(PROJECT_ZWAR, 'ru', 'en');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('CDOH', () => {
    test('is false if interview lang is locale', () => {
        const actual = showTranslationTab(PROJECT_CDOH, 'es', 'es');
        const expected = false;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const actual = showTranslationTab(PROJECT_CDOH, 'es', 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('MOG', () => {
    test('is true if interview lang is locale', () => {
        const actual = showTranslationTab(PROJECT_MOG, 'el', 'el');
        const expected = true;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const actual = showTranslationTab(PROJECT_MOG, 'el', 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('other projects', () => {
    test('is true if interview lang is locale', () => {
        const actual = showTranslationTab('dummy', 'en', 'en');
        const expected = true;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const actual = showTranslationTab('dummy', 'en', 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });
});
