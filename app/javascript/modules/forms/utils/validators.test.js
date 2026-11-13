import {
    validateColor,
    validateDate,
    validateGeoCoordinate,
    validateTapeNumber,
    validateTimecode,
    validateTimecodeInRange,
} from './validators';

describe('validateTapeNumber', () => {
    it('returns true for 0', () => {
        expect(validateTapeNumber(0)).toBeTruthy();
    });

    it('returns true for single digit number', () => {
        expect(validateTapeNumber(9)).toBeTruthy();
    });

    it('returns true for two digit number', () => {
        expect(validateTapeNumber(99)).toBeTruthy();
    });

    it('returns false for three digit number', () => {
        expect(validateTapeNumber(999)).toBeFalsy();
    });

    it('returns false for negative number', () => {
        expect(validateTapeNumber(-1)).toBeFalsy();
    });
});

describe('validateColor', () => {
    it('accepts standard hex format', () => {
        const result = validateColor('#3a5f00');
        expect(result).toBeTruthy();
    });

    it('accepts uppercase letters', () => {
        const result = validateColor('#3A5F00');
        expect(result).toBeTruthy();
    });
});

describe('validateGeoCoordinate', () => {
    it('accepts a float', () => {
        const result = validateGeoCoordinate('51.513889312744');
        expect(result).toBeTruthy();
    });

    it('accepts negative values', () => {
        const result = validateGeoCoordinate('-6');
        expect(result).toBeTruthy();
    });

    it('accepts empty values', () => {
        const result = validateGeoCoordinate('');
        expect(result).toBeTruthy();
    });

    it('rejects value containing cardinal direction', () => {
        const result = validateGeoCoordinate('S023.547500');
        expect(result).toBeFalsy();
    });

    it('rejects a large integer', () => {
        const result = validateGeoCoordinate('513889312744');
        expect(result).toBeFalsy();
    });
});

describe('validateDate', () => {
    it('accepts standard format', () => {
        const result = validateDate('2017-05-13');
        expect(result).toBeTruthy();
    });

    it('rejects non-standard format', () => {
        const result = validateDate('17-5-13');
        expect(result).toBeFalsy();
    });

    it('rejects another non-standard format', () => {
        const result = validateDate('13.05.2017');
        expect(result).toBeFalsy();
    });
});

describe('canonical segment timecodes', () => {
    it.each(['00:00:00.000', '99:59:59.999', '100:00:00.000'])(
        'accepts %s',
        (timecode) => expect(validateTimecode(timecode)).toBe(true)
    );

    it.each([
        '00:00:00',
        '00:00:00.0',
        '00:00:00.00',
        '00:00:00:000',
        '00:60:00.000',
        '00:00:60.000',
        '010:00:00.000',
        '00:00:00.000\n',
    ])('rejects %j', (timecode) => {
        expect(validateTimecode(timecode)).toBe(false);
    });

    it('keeps neighboring bounds exclusive across the 100-hour boundary', () => {
        const lower = '99:59:59.999';
        const upper = '100:00:00.001';
        expect(validateTimecodeInRange('100:00:00.000', lower, upper)).toBe(
            true
        );
        expect(validateTimecodeInRange(lower, lower, upper)).toBe(false);
        expect(validateTimecodeInRange(upper, lower, upper)).toBe(false);
    });
});

describe('validateTimecodeInRange', () => {
    it('accepts timecode between min and max', () => {
        const result = validateTimecodeInRange(
            '00:01:30.000',
            '00:01:00.000',
            '00:02:00.000'
        );
        expect(result).toBeTruthy();
    });

    it('rejects timecode equal to min', () => {
        const result = validateTimecodeInRange(
            '00:01:00.000',
            '00:01:00.000',
            '00:02:00.000'
        );
        expect(result).toBeFalsy();
    });

    it('rejects timecode equal to max', () => {
        const result = validateTimecodeInRange(
            '00:02:00.000',
            '00:01:00.000',
            '00:02:00.000'
        );
        expect(result).toBeFalsy();
    });

    it('rejects timecode below min', () => {
        const result = validateTimecodeInRange(
            '00:00:30.000',
            '00:01:00.000',
            '00:02:00.000'
        );
        expect(result).toBeFalsy();
    });

    it('rejects timecode above max', () => {
        const result = validateTimecodeInRange(
            '00:02:30.000',
            '00:01:00.000',
            '00:02:00.000'
        );
        expect(result).toBeFalsy();
    });

    it('accepts timecode with only min constraint', () => {
        const result = validateTimecodeInRange(
            '00:01:30.000',
            '00:01:00.000',
            null
        );
        expect(result).toBeTruthy();
    });

    it('accepts timecode with only max constraint', () => {
        const result = validateTimecodeInRange(
            '00:01:30.000',
            null,
            '00:02:00.000'
        );
        expect(result).toBeTruthy();
    });

    it('accepts timecode with no constraints', () => {
        const result = validateTimecodeInRange('00:01:30.000', null, null);
        expect(result).toBeTruthy();
    });

    it('handles milliseconds correctly', () => {
        const result = validateTimecodeInRange(
            '00:01:30.500',
            '00:01:30.000',
            '00:01:31.000'
        );
        expect(result).toBeTruthy();
    });

    it('rejects invalid timecode format', () => {
        const result = validateTimecodeInRange(
            '1:30',
            '00:01:00.000',
            '00:02:00.000'
        );
        expect(result).toBeFalsy();
    });

    it('rejects noncanonical bounds', () => {
        expect(validateTimecodeInRange('00:01:30.000', '00:01:00', null)).toBe(
            false
        );
        expect(
            validateTimecodeInRange('00:01:30.000', null, '00:02:00:000')
        ).toBe(false);
    });
});
