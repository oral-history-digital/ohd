import { formatYearRange, getMinMaxYear } from './dateUtils';

describe('dateUtils', () => {
    describe('getMinMaxYear', () => {
        it('returns null for empty array', () => {
            expect(getMinMaxYear([])).toBeNull();
        });

        it('returns null for array with invalid dates', () => {
            expect(getMinMaxYear(['invalid', 'dates'])).toBeNull();
        });

        it('returns min and max year for valid dates', () => {
            const dates = ['2020-01-15', '2022-06-30', '2021-12-25'];
            const result = getMinMaxYear(dates);
            expect(result).toEqual([2020, 2022]);
        });

        it('returns same year twice when all dates are in same year', () => {
            const dates = ['2021-01-15', '2021-06-30', '2021-12-25'];
            const result = getMinMaxYear(dates);
            expect(result).toEqual([2021, 2021]);
        });

        it('ignores invalid dates in mixed array', () => {
            const dates = ['2020-01-15', 'invalid', '2022-06-30'];
            const result = getMinMaxYear(dates);
            expect(result).toEqual([2020, 2022]);
        });

        it('handles single valid date', () => {
            const dates = ['2021-05-10'];
            const result = getMinMaxYear(dates);
            expect(result).toEqual([2021, 2021]);
        });

        it('handles ISO date format', () => {
            const dates = ['2019-03-01T10:30:00Z', '2023-11-15T14:45:00Z'];
            const result = getMinMaxYear(dates);
            expect(result).toEqual([2019, 2023]);
        });
    });

    describe('formatYearRange', () => {
        it('returns single year when both years are equal', () => {
            expect(formatYearRange(2021, 2021)).toBe('2021');
        });

        it('returns formatted range with en-dash when years differ', () => {
            expect(formatYearRange(2020, 2022)).toBe('2020–2022');
        });

        it('uses en-dash character (U+2013) not hyphen', () => {
            const result = formatYearRange(2020, 2022);
            expect(result).toContain('–');
            expect(result).not.toContain('-');
        });

        it('handles large year ranges', () => {
            expect(formatYearRange(1900, 2024)).toBe('1900–2024');
        });
    });

    describe('integration', () => {
        it('correctly processes dates and formats year range', () => {
            const dates = ['2010-01-01', '2015-06-15', '2010-12-31'];
            const [minYear, maxYear] = getMinMaxYear(dates);
            const formatted = formatYearRange(minYear, maxYear);
            expect(formatted).toBe('2010–2015');
        });
    });
});
