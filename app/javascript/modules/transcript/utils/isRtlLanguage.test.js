import { isRtlLanguage } from './isRtlLanguage';

jest.mock('modules/constants', () => ({
    RTL_LANGUAGES: ['ara', 'heb'],
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
});
