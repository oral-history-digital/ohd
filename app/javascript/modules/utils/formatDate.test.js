import formatDate from './formatDate';

describe('formatDate', () => {
    it('formats dates with medium style by default', () => {
        expect(formatDate('2026-06-01', 'en')).toBe('Jun 1, 2026');
        expect(formatDate('2026-06-01', 'de')).toBe('01.06.2026');
    });

    it('formats dates with short style when specified', () => {
        expect(formatDate('2026-06-01', 'en', { dateStyle: 'short' })).toBe(
            '6/1/26'
        );
        expect(formatDate('2026-06-01', 'de', { dateStyle: 'short' })).toBe(
            '01.06.26'
        );
    });

    it('returns null for blank or invalid values', () => {
        expect(formatDate(null, 'en')).toBeNull();
        expect(formatDate('not-a-date', 'en')).toBeNull();
    });

    it('accepts Intl date format options', () => {
        expect(formatDate('2026-06-01', 'en', { year: 'numeric' })).toBe(
            '2026'
        );
        expect(formatDate('2026-06-01', 'de', { month: 'long' })).toBe('Juni');
    });
});
