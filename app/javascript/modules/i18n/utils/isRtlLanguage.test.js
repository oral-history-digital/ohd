import { isRtlLanguage } from './isRtlLanguage';

jest.mock('modules/constants', () => ({
    RTL_LANGUAGES: ['ara', 'heb'],
    ALPHA2_TO_ALPHA3: {
        de: 'ger',
        en: 'eng',
        el: 'gre',
        es: 'spa',
        ru: 'rus',
        uk: 'ukr',
        ar: 'ara',
    },
}));

describe('isRtlLanguage', () => {
    it('returns true for Arabic', () => {
        expect(isRtlLanguage('ara')).toBe(true);
    });

    it('returns true for Hebrew', () => {
        expect(isRtlLanguage('heb')).toBe(true);
    });

    it('returns false for English', () => {
        expect(isRtlLanguage('eng')).toBe(false);
    });

    it('returns false for German', () => {
        expect(isRtlLanguage('deu')).toBe(false);
    });

    it('returns false for undefined', () => {
        expect(isRtlLanguage(undefined)).toBe(false);
    });

    it('returns false for empty string', () => {
        expect(isRtlLanguage('')).toBe(false);
    });

    it('returns false for null', () => {
        expect(isRtlLanguage(null)).toBe(false);
    });

    it('handles alpha-2 codes by converting to alpha-3', () => {
        expect(isRtlLanguage('de')).toBe(false); // German alpha-2
        expect(isRtlLanguage('en')).toBe(false); // English alpha-2
        expect(isRtlLanguage('el')).toBe(false); // Greek alpha-2
        expect(isRtlLanguage('es')).toBe(false); // Spanish alpha-2
        expect(isRtlLanguage('ru')).toBe(false); // Russian alpha-2
        expect(isRtlLanguage('uk')).toBe(false); // Ukrainian alpha-2
        expect(isRtlLanguage('ar')).toBe(true); // Arabic alpha-2
    });
});
