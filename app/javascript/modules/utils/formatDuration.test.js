import { formatDuration, formatDurationFromSeconds } from './formatDuration';

describe('formatDuration', () => {
    test('should format timecode strings as hours and minutes', () => {
        expect(formatDuration('01:48:00.000')).toEqual('01 h 48 min');
    });

    test('should format timecode strings with surrounding whitespace', () => {
        expect(formatDuration(' 02:05:10 ')).toEqual('02 h 05 min');
    });

    test('should format numeric strings interpreted as seconds', () => {
        expect(formatDuration('3600')).toEqual('01 h 00 min');
    });

    test('should format numeric values interpreted as seconds', () => {
        expect(formatDuration(3725)).toEqual('01 h 02 min');
    });

    test('should return fallback for null and undefined', () => {
        expect(formatDuration(null, 'N/A')).toEqual('N/A');
        expect(formatDuration(undefined, 'N/A')).toEqual('N/A');
    });

    test('should return fallback for unsupported value types', () => {
        expect(formatDuration({ raw: '01:00:00' }, 'N/A')).toEqual('N/A');
    });

    test('should return fallback for unrecognized strings', () => {
        expect(formatDuration('unknown', 'N/A')).toEqual('N/A');
    });
});

describe('formatDurationFromSeconds', () => {
    test('should floor fractional seconds', () => {
        expect(formatDurationFromSeconds(59.9)).toEqual('00 h 00 min');
    });

    test('should clamp negative numbers to zero', () => {
        expect(formatDurationFromSeconds(-10)).toEqual('00 h 00 min');
    });

    test('should return null for non-finite values', () => {
        expect(formatDurationFromSeconds(Number.NaN)).toBeNull();
        expect(formatDurationFromSeconds(Number.POSITIVE_INFINITY)).toBeNull();
    });
});
