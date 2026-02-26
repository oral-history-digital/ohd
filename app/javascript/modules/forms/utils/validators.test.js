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

describe('validateTimecode', () => {
    it('accepts HH:MM:SS format', () => {
        expect(validateTimecode('01:23:45')).toBeTruthy();
    });

    it('accepts HH:MM:SS.mmm format', () => {
        expect(validateTimecode('01:23:45.123')).toBeTruthy();
    });

    it('accepts HH:MM:SS.m format', () => {
        expect(validateTimecode('01:23:45.1')).toBeTruthy();
    });

    it('rejects invalid format', () => {
        expect(validateTimecode('1:23:45')).toBeFalsy();
    });

    it('rejects missing colons', () => {
        expect(validateTimecode('012345')).toBeFalsy();
    });
});

describe('validateTimecode with format', () => {
    describe('ms format', () => {
        it('accepts HH:MM:SS.mmm (3 decimal places)', () => {
            expect(validateTimecode('01:23:45.123', 'ms')).toBeTruthy();
        });

        it('accepts HH:MM:SS (no decimals)', () => {
            expect(validateTimecode('01:23:45', 'ms')).toBeTruthy();
        });

        it('rejects HH:MM:SS.ff (2 decimal places)', () => {
            expect(validateTimecode('01:23:45.12', 'ms')).toBeFalsy();
        });

        it('rejects HH:MM:SS.m (1 decimal place)', () => {
            expect(validateTimecode('01:23:45.1', 'ms')).toBeFalsy();
        });
    });

    describe('frames format', () => {
        it('accepts HH:MM:SS.ff (2 decimal places)', () => {
            expect(validateTimecode('01:23:45.12', 'frames')).toBeTruthy();
        });

        it('accepts HH:MM:SS (no decimals)', () => {
            expect(validateTimecode('01:23:45', 'frames')).toBeTruthy();
        });

        it('rejects HH:MM:SS.mmm (3 decimal places)', () => {
            expect(validateTimecode('01:23:45.123', 'frames')).toBeFalsy();
        });

        it('rejects HH:MM:SS.m (1 decimal place)', () => {
            expect(validateTimecode('01:23:45.1', 'frames')).toBeFalsy();
        });

        it('accepts frame 00 (00:00:00.00)', () => {
            expect(validateTimecode('00:00:00.00', 'frames')).toBeTruthy();
        });

        it('accepts frame 24 (max at 25fps)', () => {
            expect(validateTimecode('00:00:59.24', 'frames')).toBeTruthy();
        });
    });
});

describe('validateTimecodeInRange', () => {
    it('accepts timecode between min and max', () => {
        const result = validateTimecodeInRange(
            '00:01:30',
            '00:01:00',
            '00:02:00'
        );
        expect(result).toBeTruthy();
    });

    it('rejects timecode equal to min', () => {
        const result = validateTimecodeInRange(
            '00:01:00',
            '00:01:00',
            '00:02:00'
        );
        expect(result).toBeFalsy();
    });

    it('rejects timecode equal to max', () => {
        const result = validateTimecodeInRange(
            '00:02:00',
            '00:01:00',
            '00:02:00'
        );
        expect(result).toBeFalsy();
    });

    it('rejects timecode below min', () => {
        const result = validateTimecodeInRange(
            '00:00:30',
            '00:01:00',
            '00:02:00'
        );
        expect(result).toBeFalsy();
    });

    it('rejects timecode above max', () => {
        const result = validateTimecodeInRange(
            '00:02:30',
            '00:01:00',
            '00:02:00'
        );
        expect(result).toBeFalsy();
    });

    it('accepts timecode with only min constraint', () => {
        const result = validateTimecodeInRange('00:01:30', '00:01:00', null);
        expect(result).toBeTruthy();
    });

    it('accepts timecode with only max constraint', () => {
        const result = validateTimecodeInRange('00:01:30', null, '00:02:00');
        expect(result).toBeTruthy();
    });

    it('accepts timecode with no constraints', () => {
        const result = validateTimecodeInRange('00:01:30', null, null);
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
        const result = validateTimecodeInRange('1:30', '00:01:00', '00:02:00');
        expect(result).toBeFalsy();
    });
});
