import { findTranslationForLocale } from './findTranslationForLocale';

describe('findTranslationForLocale', () => {
    it('returns null when no translations exist', () => {
        expect(findTranslationForLocale(null, null, 'de')).toBeNull();
    });

    it('does not throw and returns translation for non-segment when data is undefined', () => {
        const formValues = {
            translations_attributes: [
                { locale: 'de', descriptor: 'Beschreibung' },
            ],
        };

        expect(() =>
            findTranslationForLocale(undefined, formValues, 'de')
        ).not.toThrow();

        expect(findTranslationForLocale(undefined, formValues, 'de')).toEqual({
            locale: 'de',
            descriptor: 'Beschreibung',
        });
    });

    it('for segment records, fills empty values from locale-public', () => {
        const data = {
            type: 'Segment',
            translations_attributes: [
                {
                    locale: 'deu',
                    text: '',
                    mainheading: '',
                    subheading: 'Vorhanden',
                },
                {
                    locale: 'deu-public',
                    text: 'Public text',
                    mainheading: 'Public heading',
                    subheading: 'Public subheading',
                },
            ],
        };

        expect(findTranslationForLocale(data, {}, 'deu')).toEqual({
            locale: 'deu',
            text: 'Public text',
            mainheading: 'Public heading',
            subheading: 'Vorhanden',
        });
    });

    it('for segment records, falls back to locale-public when no original exists', () => {
        const data = {
            type: 'Segment',
            translations_attributes: [
                {
                    locale: 'deu-public',
                    text: 'Public text only',
                },
            ],
        };

        expect(findTranslationForLocale(data, {}, 'deu')).toEqual({
            locale: 'deu-public',
            text: 'Public text only',
        });
    });
});
