import { detectTimecodeFormat, normalizeTimecode } from 'modules/utils';

import { formatTimecode, timecodeToSeconds } from './timeUtils';

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

describe('normalizeTimecode', () => {
    it('returns timecode unchanged if already in dot format', () => {
        expect(normalizeTimecode('00:01:30.500')).toBe('00:01:30.500');
    });

    it('converts colon separator to dot separator', () => {
        expect(normalizeTimecode('00:01:30:500')).toBe('00:01:30.500');
    });

    it('converts colon format with frames', () => {
        expect(normalizeTimecode('00:00:41:00')).toBe('00:00:41.00');
    });

    it('returns timecode unchanged if no sub-seconds', () => {
        expect(normalizeTimecode('00:01:30')).toBe('00:01:30');
    });

    it('returns null for null input', () => {
        expect(normalizeTimecode(null)).toBeNull();
    });

    it('returns null for undefined input', () => {
        expect(normalizeTimecode(undefined)).toBeNull();
    });

    it('returns null for empty string', () => {
        expect(normalizeTimecode('')).toBeNull();
    });

    it('returns null for invalid format (too few parts)', () => {
        expect(normalizeTimecode('01:30')).toBeNull();
    });

    it('returns null for invalid format (too many parts)', () => {
        expect(normalizeTimecode('00:01:30:500:100')).toBeNull();
    });

    it('handles complex timecodes with hours', () => {
        expect(normalizeTimecode('01:02:03:456')).toBe('01:02:03.456');
    });
});

describe('timecodeToSeconds', () => {
    it('converts HH:MM:SS format', () => {
        expect(timecodeToSeconds('00:01:30')).toBe(90);
    });

    it('converts HH:MM:SS.mmm format (milliseconds)', () => {
        expect(timecodeToSeconds('00:01:30.500')).toBeCloseTo(90.5);
    });

    it('converts HH:MM:SS.ff format (frames at 25fps)', () => {
        // "00:00:01.12" → 1 second + frame 12 of 25 = 1 + 12/25 = 1.48
        expect(timecodeToSeconds('00:00:01.12')).toBeCloseTo(1.48);
    });

    it('handles hours', () => {
        expect(timecodeToSeconds('01:00:00')).toBe(3600);
    });

    it('handles zero timecode', () => {
        expect(timecodeToSeconds('00:00:00')).toBe(0);
    });

    it('handles zero timecode with milliseconds', () => {
        expect(timecodeToSeconds('00:00:00.000')).toBe(0);
    });

    it('returns 0 for null', () => {
        expect(timecodeToSeconds(null)).toBe(0);
    });

    it('returns 0 for undefined', () => {
        expect(timecodeToSeconds(undefined)).toBe(0);
    });

    it('returns 0 for empty string', () => {
        expect(timecodeToSeconds('')).toBe(0);
    });

    it('returns 0 for invalid format', () => {
        expect(timecodeToSeconds('invalid')).toBe(0);
    });

    it('converts a complex timecode with all parts', () => {
        // 1h 2m 3s 456ms = 3600 + 120 + 3 + 0.456 = 3723.456
        expect(timecodeToSeconds('01:02:03.456')).toBeCloseTo(3723.456);
    });

    it('converts HH:MM:SS:ff format (frames with colon separator)', () => {
        // "00:00:01:12" → 1 second + frame 12 of 25 = 1 + 12/25 = 1.48
        expect(timecodeToSeconds('00:00:01:12')).toBeCloseTo(1.48);
    });

    it('converts HH:MM:SS:mmm format (milliseconds with colon separator)', () => {
        // "00:01:30:500" → 90.5 seconds
        expect(timecodeToSeconds('00:01:30:500')).toBeCloseTo(90.5);
    });

    it('converts timecode with leading tape number in colon format', () => {
        // "00:00:41:00" (used in the user's case) = 41 seconds
        expect(timecodeToSeconds('00:00:41:00')).toBe(41);
    });

    it('converts complex timecode in colon format', () => {
        // "00:00:37:00" should be 37 seconds
        expect(timecodeToSeconds('00:00:37:00')).toBe(37);
        // "00:00:51:00" should be 51 seconds
        expect(timecodeToSeconds('00:00:51:00')).toBe(51);
    });
});

describe('formatTimecode', () => {
    test('displays seconds correctly', () => {
        const actual = formatTimecode(25.3);
        const expected = '0:00:25';
        expect(actual).toEqual(expected);
    });

    test('displays minutes correctly', () => {
        const actual = formatTimecode(645.2);
        const expected = '0:10:45';
        expect(actual).toEqual(expected);
    });

    test('displays hours correctly', () => {
        const actual = formatTimecode(9905.9);
        const expected = '2:45:05';
        expect(actual).toEqual(expected);
    });

    test('can use hms format,', () => {
        const actual = formatTimecode(9905.9, true);
        const expected = '2h45m05s';
        expect(actual).toEqual(expected);
    });

    test('does not crash when input is null', () => {
        const actual = formatTimecode(null, true);
        const expected = '0h00m00s';
        expect(actual).toEqual(expected);
    });

    test('does not crash when input is undefined', () => {
        const actual = formatTimecode(undefined, true);
        const expected = 'NaNhNaNmNaNs';
        expect(actual).toEqual(expected);
    });

    test('does not crash when input is empty string', () => {
        const actual = formatTimecode('', true);
        const expected = '0h00m00s';
        expect(actual).toEqual(expected);
    });

    test('includes milliseconds when requested', () => {
        const actual = formatTimecode(25.3, false, true);
        const expected = '0:00:25.300';
        expect(actual).toEqual(expected);
    });

    test('includes milliseconds for minutes correctly', () => {
        const actual = formatTimecode(645.123, false, true);
        const expected = '0:10:45.123';
        expect(actual).toEqual(expected);
    });

    test('includes milliseconds for hours correctly', () => {
        const actual = formatTimecode(9905.9, false, true);
        const expected = '2:45:05.900';
        expect(actual).toEqual(expected);
    });

    test('does not include milliseconds when flag is false', () => {
        const actual = formatTimecode(25.999, false, false);
        const expected = '0:00:25';
        expect(actual).toEqual(expected);
    });

    test('milliseconds parameter is honored in HMS format', () => {
        const actual = formatTimecode(645.123, true, true);
        const expected = '0h10m45.123s';
        expect(actual).toEqual(expected);
    });

    test('handles zero milliseconds correctly', () => {
        const actual = formatTimecode(60, false, true);
        const expected = '0:01:00.000';
        expect(actual).toEqual(expected);
    });

    test('strips leading zeros from minutes when hours are zero', () => {
        const actual = formatTimecode(226, false, false, true); // 00:03:46
        const expected = '3:46';
        expect(actual).toEqual(expected);
    });

    test('strips leading zeros from hours but keeps minute padding when hours > 0', () => {
        const actual = formatTimecode(4048, false, false, true); // 01:07:28
        const expected = '1:07:28';
        expect(actual).toEqual(expected);
    });

    test('strips leading zeros with only seconds', () => {
        const actual = formatTimecode(45, false, false, true); // 00:00:45
        const expected = '0:45';
        expect(actual).toEqual(expected);
    });

    test('strips leading zeros with double-digit minutes', () => {
        const actual = formatTimecode(725, false, false, true); // 00:12:05
        const expected = '12:05';
        expect(actual).toEqual(expected);
    });

    test('does not strip zeros when stripLeadingZeros is false', () => {
        const actual = formatTimecode(226, false, false, false);
        const expected = '0:03:46';
        expect(actual).toEqual(expected);
    });

    test('strips leading zeros with milliseconds', () => {
        const actual = formatTimecode(226.5, false, true, true); // 00:03:46.500
        const expected = '3:46.500';
        expect(actual).toEqual(expected);
    });

    test('strips leading zeros correctly for multi-hour duration', () => {
        const actual = formatTimecode(9905.9, false, false, true); // 2:45:05
        const expected = '2:45:05';
        expect(actual).toEqual(expected);
    });

    test('does not strip leading zeros in HMS format', () => {
        const actual = formatTimecode(226, true, false, true);
        const expected = '0h03m46s';
        expect(actual).toEqual(expected);
    });

    test('strips leading zeros with 10+ hours', () => {
        const actual = formatTimecode(36125, false, false, true); // 10:02:05
        const expected = '10:02:05';
        expect(actual).toEqual(expected);
    });

    describe('format parameter (frames)', () => {
        test('formats sub-seconds as 2-digit frame number at 25fps', () => {
            // 1s + 12/25 = 1.48s → frame 12
            const actual = formatTimecode(1.48, false, true, false, 'frames');
            expect(actual).toEqual('0:00:01.12');
        });

        test('frame 0 is padded to two digits', () => {
            const actual = formatTimecode(10, false, true, false, 'frames');
            expect(actual).toEqual('0:00:10.00');
        });

        test('rounds to nearest frame', () => {
            // 0.5s = 0.5 * 25 = 12.5 → rounds to 13
            const actual = formatTimecode(0.5, false, true, false, 'frames');
            expect(actual).toEqual('0:00:00.13');
        });

        test('works in HMS format', () => {
            // 9905 + 12/25 = 9905.48s → 2h45m05s, frame 12
            const actual = formatTimecode(9905.48, true, true, false, 'frames');
            expect(actual).toEqual('2h45m05.12s');
        });

        test('works with stripLeadingZeros', () => {
            // 226 + 12/25 = 226.48s → 3:46.12
            const actual = formatTimecode(226.48, false, true, true, 'frames');
            expect(actual).toEqual('3:46.12');
        });

        test('format ms still produces 3-digit milliseconds (explicit parameter)', () => {
            const actual = formatTimecode(25.3, false, true, false, 'ms');
            expect(actual).toEqual('0:00:25.300');
        });

        test('default format (no 5th arg) is ms-compatible', () => {
            const actual = formatTimecode(25.3, false, true);
            expect(actual).toEqual('0:00:25.300');
        });

        test('round-trips with detectTimecodeFormat and timecodeToSeconds for ms', () => {
            // formatTimecode uses single-digit hours, so '01:02:03.456' → '1:02:03.456'
            const timecode = '01:02:03.456';
            const fmt = detectTimecodeFormat(timecode);
            const seconds = timecodeToSeconds(timecode);
            expect(formatTimecode(seconds, false, true, false, fmt)).toEqual(
                '1:02:03.456'
            );
        });

        test('round-trips with detectTimecodeFormat and timecodeToSeconds for frames', () => {
            // formatTimecode uses single-digit hours, so '00:01:30.12' → '0:01:30.12'
            const timecode = '00:01:30.12';
            const fmt = detectTimecodeFormat(timecode);
            const seconds = timecodeToSeconds(timecode);
            expect(formatTimecode(seconds, false, true, false, fmt)).toEqual(
                '0:01:30.12'
            );
        });
    });
});
