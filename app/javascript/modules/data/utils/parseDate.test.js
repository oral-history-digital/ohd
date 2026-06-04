import { parseDate } from './parseDate';

describe('parseDate', () => {
    it('parses ISO dates in YYYY-MM-DD format', () => {
        const result = parseDate('2026-02-13');

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(1); // February, zero-based
        expect(result.getDate()).toBe(13);
    });

    it('parses German-style dates in DD.MM.YYYY format', () => {
        const result = parseDate('13.02.2026');

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(1);
        expect(result.getDate()).toBe(13);
    });

    it('parses US-style dates in MM/DD/YYYY format', () => {
        const result = parseDate('02/13/2026');

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(1);
        expect(result.getDate()).toBe(13);
    });

    it('parses dates when month/day do not use leading zeros', () => {
        const isoResult = parseDate('2026-2-3');
        const germanResult = parseDate('3.2.2026');
        const usResult = parseDate('2/3/2026');

        [isoResult, germanResult, usResult].forEach((result) => {
            expect(result).toBeInstanceOf(Date);
            expect(result.getFullYear()).toBe(2026);
            expect(result.getMonth()).toBe(1);
            expect(result.getDate()).toBe(3);
        });
    });

    it('returns trimmed original string when the format does not match', () => {
        expect(parseDate('2026/02/13')).toBe('2026/02/13');
        expect(parseDate('13-02-2026')).toBe('13-02-2026');
        expect(parseDate('February 13, 2026')).toBe('February 13, 2026');
        expect(parseDate(' 2026.02.13 ')).toBe('2026.02.13');
    });

    it('returns trimmed original string for invalid ISO dates', () => {
        expect(parseDate('2026-02-31')).toBe('2026-02-31');
        expect(parseDate(' 2026-13-01 ')).toBe('2026-13-01');
    });

    it('returns trimmed original string for invalid German-style dates', () => {
        expect(parseDate('31.02.2026')).toBe('31.02.2026');
        expect(parseDate(' 31.02.2026 ')).toBe('31.02.2026');
    });

    it('returns trimmed original string for invalid US-style dates', () => {
        expect(parseDate('02/31/2026')).toBe('02/31/2026');
        expect(parseDate(' 02/31/2026 ')).toBe('02/31/2026');
    });

    it('returns trimmed original string for invalid months', () => {
        expect(parseDate('2026-13-01')).toBe('2026-13-01');
        expect(parseDate('01.13.2026')).toBe('01.13.2026');
        expect(parseDate('13/01/2026')).toBe('13/01/2026');
        expect(parseDate(' 2026-13-01 ')).toBe('2026-13-01');
        expect(parseDate(' 01.13.2026 ')).toBe('01.13.2026');
        expect(parseDate(' 13/01/2026 ')).toBe('13/01/2026');
    });

    it('returns trimmed original string for invalid days', () => {
        expect(parseDate('2026-01-32')).toBe('2026-01-32');
        expect(parseDate('32.01.2026')).toBe('32.01.2026');
        expect(parseDate('01/32/2026')).toBe('01/32/2026');
        expect(parseDate(' 2026-01-32 ')).toBe('2026-01-32');
        expect(parseDate(' 32.01.2026 ')).toBe('32.01.2026');
        expect(parseDate(' 01/32/2026 ')).toBe('01/32/2026');
    });

    it('supports leap-year dates', () => {
        const result = parseDate('2024-02-29');

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(1); // February, zero-based
        expect(result.getDate()).toBe(29);
    });

    it('rejects non-leap-year February 29 dates', () => {
        expect(parseDate('2026-02-29')).toBe('2026-02-29');
    });

    it('trims whitespace before parsing', () => {
        const result = parseDate(' 2026-02-13 ');

        expect(result).toBeInstanceOf(Date);
        expect(result.getFullYear()).toBe(2026);
        expect(result.getMonth()).toBe(1); // February, zero-based
        expect(result.getDate()).toBe(13);
    });

    it('returns non-string values unchanged', () => {
        expect(parseDate(null)).toBe(null);
        expect(parseDate(undefined)).toBe(undefined);
        expect(parseDate(123)).toBe(123);

        const date = new Date(2026, 1, 13);
        expect(parseDate(date)).toBe(date);
    });
});
