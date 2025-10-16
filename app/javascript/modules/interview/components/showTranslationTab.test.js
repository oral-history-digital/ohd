import { PROJECT_ZWAR, PROJECT_CDOH } from 'modules/constants';
import showTranslationTab from './showTranslationTab';

describe('ZWAR', () => {
    test('is false if interview lang is German', () => {
        const project = { shortname: PROJECT_ZWAR };
        const interview = {
            alpha2: 'de',
            languages: ['de', 'ru'],
            alpha3s_with_transcript: ['de', 'ru'],
            translation_alpha3s: 'en',
        };
        const actual = showTranslationTab(project, interview, 'en');
        const expected = false;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const project = { shortname: PROJECT_ZWAR };
        const interview = {
            alpha2: 'ru',
            languages: ['de', 'ru'],
            alpha3s_with_transcript: ['de', 'ru'],
            translation_alpha3s: 'ru',
        };
        const actual = showTranslationTab(project, interview, 'en');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('CDOH', () => {
    test('is false if interview lang is locale', () => {
        const project = { shortname: PROJECT_CDOH };
        const interview = {
            alpha2: 'es',
            languages: ['de', 'es'],
            alpha3s_with_transcript: ['de', 'es'],
            translation_alpha3s: 'de',
        };
        const actual = showTranslationTab(project, interview, 'es');
        const expected = false;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const project = { shortname: PROJECT_CDOH };
        const interview = {
            alpha2: 'es',
            languages: ['de', 'es'],
            alpha3s_with_transcript: ['de', 'es'],
            translation_alpha3s: 'de',
        };
        const actual = showTranslationTab(project, interview, 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('other projects', () => {
    test('is false if interview lang is locale', () => {
        const project = { shortname: 'dummy' };
        const interview = {
            alpha2: 'en',
            languages: ['en', 'de'],
            alpha3s_with_transcript: ['en', 'de'],
            translation_alpha3s: 'de',
        };
        const actual = showTranslationTab(project, interview, 'en');
        const expected = false;
        expect(actual).toBe(expected);
    });

    test('is true otherwise', () => {
        const project = { shortname: 'dummy' };
        const interview = {
            alpha2: 'en',
            languages: ['en', 'de'],
            alpha3s_with_transcript: ['en', 'de'],
            translation_alpha3s: 'de',
        };
        const actual = showTranslationTab(project, interview, 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });
});

describe('transcript availability', () => {
    test('is true if translated transcript is available', () => {
        const project = { shortname: 'dummy' };
        const interview = {
            alpha2: 'en',
            languages: ['en', 'de'],
            alpha3s_with_transcript: ['en', 'de'],
            translation_alpha3s: 'de',
        };
        const actual = showTranslationTab(project, interview, 'de');
        const expected = true;
        expect(actual).toBe(expected);
    });

    test('is false if translated transcript is not available', () => {
        const project = { shortname: 'dummy' };
        const interview = {
            alpha2: 'en',
            languages: ['en', 'de'],
            alpha3s_with_transcript: ['en'],
            translation_alpha3s: 'de',
        };
        const actual = showTranslationTab(project, interview, 'de');
        const expected = false;
        expect(actual).toBe(expected);
    });
});
