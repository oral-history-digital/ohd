import { getMergedTranslations } from './getMergedTranslations';

describe('getMergedTranslations', () => {
    it('returns empty array when both inputs have no translations', () => {
        expect(getMergedTranslations({}, {})).toEqual([]);
        expect(getMergedTranslations(null, null)).toEqual([]);
    });

    it('supports object-shaped translations_attributes', () => {
        const data = {
            translations_attributes: {
                a: { locale: 'de', descriptor: 'Persisted DE' },
            },
        };

        const formValues = {
            translations_attributes: {
                b: { locale: 'en', descriptor: 'Form EN' },
            },
        };

        expect(getMergedTranslations(data, formValues)).toEqual([
            { locale: 'de', descriptor: 'Persisted DE' },
            { locale: 'en', descriptor: 'Form EN' },
        ]);
    });

    it('supports array-shaped translations_attributes', () => {
        const data = {
            translations_attributes: [
                { locale: 'de', descriptor: 'Persisted DE' },
            ],
        };

        const formValues = {
            translations_attributes: [{ locale: 'en', descriptor: 'Form EN' }],
        };

        expect(getMergedTranslations(data, formValues)).toEqual([
            { locale: 'de', descriptor: 'Persisted DE' },
            { locale: 'en', descriptor: 'Form EN' },
        ]);
    });

    it('prioritizes form value fields when locale already exists', () => {
        const data = {
            translations_attributes: [
                { locale: 'de', descriptor: 'Persisted DE', id: 9 },
            ],
        };

        const formValues = {
            translations_attributes: [
                { locale: 'de', descriptor: 'Updated DE' },
            ],
        };

        expect(getMergedTranslations(data, formValues)).toEqual([
            { locale: 'de', descriptor: 'Updated DE', id: 9 },
        ]);
    });

    it('ignores entries without locale', () => {
        const data = {
            translations_attributes: [
                { descriptor: 'no locale' },
                { locale: 'de', descriptor: 'Persisted DE' },
            ],
        };

        const formValues = {
            translations_attributes: [
                { locale: '', descriptor: 'empty locale' },
            ],
        };

        expect(getMergedTranslations(data, formValues)).toEqual([
            { locale: 'de', descriptor: 'Persisted DE' },
        ]);
    });
});
