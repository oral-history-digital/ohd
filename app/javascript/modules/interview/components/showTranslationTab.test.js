import { PROJECT_ZWAR, PROJECT_CDOH } from 'modules/constants';
import showTranslationTab from './showTranslationTab';

describe('ZWAR', () => {
    test('is false if interview lang is German', () => {
        const project = { identifier: PROJECT_ZWAR };
        const interview = {
            lang: 'de',
            languages: ['de', 'ru'],
            locales_with_transcript: ['de', 'ru'],
        };
        const actual = showTranslationTab(project, interview, 'en');
        const expected = false;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const project = { identifier: PROJECT_ZWAR };
        const interview = {
            lang: 'ru',
            languages: ['de', 'ru'],
            locales_with_transcript: ['de', 'ru'],
        };
        const actual = showTranslationTab(project, interview, 'en');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('CDOH', () => {
    test('is false if interview lang is locale', () => {
        const project = { identifier: PROJECT_CDOH };
        const interview = {
            lang: 'es',
            languages: ['de', 'es'],
            locales_with_transcript: ['de', 'es'],
        };
        const actual = showTranslationTab(project, interview, 'es');
        const expected = false;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const project = { identifier: PROJECT_CDOH };
        const interview = {
            lang: 'es',
            languages: ['de', 'es'],
            locales_with_transcript: ['de', 'es'],
        };
        const actual = showTranslationTab(project, interview, 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('other projects', () => {
    test('is false if interview lang is locale', () => {
        const project = { identifier: 'dummy' };
        const interview = {
            lang: 'en',
            languages: ['en', 'de'],
            locales_with_transcript: ['en', 'de'],
        };
        const actual = showTranslationTab(project, interview, 'en');
        const expected = false;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const project = { identifier: 'dummy' };
        const interview = {
            lang: 'en',
            languages: ['en', 'de'],
            locales_with_transcript: ['en', 'de'],
        };
        const actual = showTranslationTab(project, interview, 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('transcript availability', () => {
    test('is true if translated transcript is available', () => {
        const project = { identifier: 'dummy' };
        const interview = {
            lang: 'en',
            languages: ['en', 'de'],
            locales_with_transcript: ['en', 'de'],
        };
        const actual = showTranslationTab(project, interview, 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });

    test('is false if translated transcript is not available', () => {
        const project = { identifier: 'dummy' };
        const interview = {
            lang: 'en',
            languages: ['en', 'de'],
            locales_with_transcript: ['en'],
        };
        const actual = showTranslationTab(project, interview, 'de');
        const expected = false;
        expect(actual).toBe(expected);
    });
});
