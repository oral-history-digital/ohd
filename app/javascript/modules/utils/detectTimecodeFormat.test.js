import { detectTimecodeFormat } from 'modules/utils';

describe('detectTimecodeFormat', () => {
    it('returns ms for 3 decimal places', () => {
        expect(detectTimecodeFormat('01:23:45.123')).toBe('ms');
    });

    it('returns frames for 2 decimal places', () => {
        expect(detectTimecodeFormat('01:23:45.12')).toBe('frames');
    });

    it('returns null for no decimal places', () => {
        expect(detectTimecodeFormat('01:23:45')).toBeNull();
    });

    it('returns null for null input', () => {
        expect(detectTimecodeFormat(null)).toBeNull();
    });

    it('returns null for undefined input', () => {
        expect(detectTimecodeFormat(undefined)).toBeNull();
    });

    it('returns null for empty string', () => {
        expect(detectTimecodeFormat('')).toBeNull();
    });

    it('returns ms for 1 decimal place (treated as ms variant)', () => {
        expect(detectTimecodeFormat('01:23:45.1')).toBe('ms');
    });
});
