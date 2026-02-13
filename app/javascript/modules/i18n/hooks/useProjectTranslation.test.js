import { useProjectTranslation } from './useProjectTranslation';

jest.mock('modules/i18n', () => ({
    useI18n: jest.fn(() => ({ locale: 'en' })),
}));

describe('useProjectTranslation', () => {
    it('returns the translation matching the current locale', () => {
        const project = {
            translations_attributes: [
                { locale: 'de', media_missing_text: 'Keine Medien' },
                { locale: 'en', media_missing_text: 'No media' },
            ],
        };

        const result = useProjectTranslation(project);

        expect(result).toEqual({
            locale: 'en',
            media_missing_text: 'No media',
        });
    });

    it('returns undefined when no matching locale is found', () => {
        const project = {
            translations_attributes: [
                { locale: 'de', media_missing_text: 'Keine Medien' },
            ],
        };

        const result = useProjectTranslation(project);

        expect(result).toBeUndefined();
    });
});
