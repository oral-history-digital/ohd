import { formatNumber } from './formatNumber';

describe('formatNumber', () => {
    test('uses project default locale (de) when locale is not provided', () => {
        expect(formatNumber(1234.56)).toBe('1.234,56');
    });

    test('formats with en locale code from project', () => {
        expect(formatNumber(1234.56, 2, 'en')).toBe('1,234.56');
    });

    test('formats with de locale code from project', () => {
        expect(formatNumber(1234.56, 2, 'de')).toBe('1.234,56');
    });

    test('supports custom decimal precision', () => {
        expect(formatNumber(1234.5678, 3, 'en')).toBe('1,234.568');
    });

    test('pretty mode hides trailing zero decimals', () => {
        expect(formatNumber(60, 2, 'en', true)).toBe('60');
        expect(formatNumber(60.1, 2, 'en', true)).toBe('60.1');
        expect(formatNumber(60.45, 2, 'en', true)).toBe('60.45');
    });
});
