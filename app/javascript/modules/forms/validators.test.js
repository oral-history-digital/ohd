import { validateTapeNumber, validateColor, validateGeoCoordinate }
    from './validators';

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

    it('accepts empty values', () => {
        const result = validateGeoCoordinate('');
        expect(result).toBeTruthy();
    });

    it('rejects value containing cardinal direction', () => {
        const result = validateGeoCoordinate('S023.547500');
        expect(result).toBeFalsy();
    });
});
