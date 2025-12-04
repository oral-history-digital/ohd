import {
    extractBirthYearRange,
    extractYearRange,
    extractYearRangeFromValues,
    findEventTypeByCode,
    isFacetDataValid,
} from './facetUtils';

describe('extractYearRange', () => {
    it('extracts min and max years from valid facet value', () => {
        expect(extractYearRange('1955.0..1960.0')).toEqual({
            min: 1955,
            max: 1960,
        });
    });

    it('returns null for undefined value', () => {
        expect(extractYearRange(undefined)).toBeNull();
    });

    it('returns null for null value', () => {
        expect(extractYearRange(null)).toBeNull();
    });

    it('returns null for non-string value', () => {
        expect(extractYearRange(123)).toBeNull();
    });

    it('returns null for empty string', () => {
        expect(extractYearRange('')).toBeNull();
    });

    it('returns null for string shorter than 12 characters', () => {
        expect(extractYearRange('1955.0')).toBeNull();
    });

    it('returns null for invalid year format', () => {
        expect(extractYearRange('abcd.0..efgh.0')).toBeNull();
    });

    it('handles edge case with valid format at exact minimum length', () => {
        expect(extractYearRange('1955.0..1960')).toEqual({
            min: 1955,
            max: 1960,
        });
    });
});

describe('extractYearRangeFromValues', () => {
    it('extracts year range from array of facet values', () => {
        const values = ['1955.0..1960.0', '1961.0..1965.0', '1966.0..1970.0'];
        expect(extractYearRangeFromValues(values)).toEqual({
            min: 1955,
            max: 1970,
        });
    });

    it('extracts year range from single value array', () => {
        const values = ['1955.0..1960.0'];
        expect(extractYearRangeFromValues(values)).toEqual({
            min: 1955,
            max: 1960,
        });
    });

    it('returns null for empty array', () => {
        expect(extractYearRangeFromValues([])).toBeNull();
    });

    it('returns null for undefined', () => {
        expect(extractYearRangeFromValues(undefined)).toBeNull();
    });

    it('returns null for non-array', () => {
        expect(extractYearRangeFromValues('not an array')).toBeNull();
    });

    it('returns null when first value is invalid', () => {
        const values = ['invalid', '1961.0..1965.0'];
        expect(extractYearRangeFromValues(values)).toBeNull();
    });

    it('returns null when last value is invalid', () => {
        const values = ['1955.0..1960.0', 'invalid'];
        expect(extractYearRangeFromValues(values)).toBeNull();
    });

    it('returns null when values contain null', () => {
        const values = [null, '1961.0..1965.0'];
        expect(extractYearRangeFromValues(values)).toBeNull();
    });
});

describe('extractBirthYearRange', () => {
    it('extracts min and max from birth year subfacets', () => {
        const subfacets = { 1920: {}, 1925: {}, 1930: {} };
        expect(extractBirthYearRange(subfacets)).toEqual({
            min: 1920,
            max: 1930,
        });
    });

    it('handles single year', () => {
        const subfacets = { 1925: {} };
        expect(extractBirthYearRange(subfacets)).toEqual({
            min: 1925,
            max: 1925,
        });
    });

    it('returns null for undefined', () => {
        expect(extractBirthYearRange(undefined)).toBeNull();
    });

    it('returns null for null', () => {
        expect(extractBirthYearRange(null)).toBeNull();
    });

    it('returns null for non-object', () => {
        expect(extractBirthYearRange('not an object')).toBeNull();
    });

    it('returns null for empty object', () => {
        expect(extractBirthYearRange({})).toBeNull();
    });

    it('returns null for invalid year values', () => {
        const subfacets = { invalid: {}, 'not-a-year': {} };
        expect(extractBirthYearRange(subfacets)).toBeNull();
    });
});

describe('isFacetDataValid', () => {
    it('returns true for valid facetData with all required properties', () => {
        const facetData = {
            name: { en: 'Test Facet', de: 'Test-Facette' },
            subfacets: { 1: {}, 2: {} },
        };
        expect(isFacetDataValid(facetData, 'en', true)).toBe(true);
    });

    it('returns true when subfacets not required and missing', () => {
        const facetData = {
            name: { en: 'Test Facet' },
        };
        expect(isFacetDataValid(facetData, 'en', false)).toBe(true);
    });

    it('returns false for null facetData', () => {
        expect(isFacetDataValid(null, 'en')).toBe(false);
    });

    it('returns false for undefined facetData', () => {
        expect(isFacetDataValid(undefined, 'en')).toBe(false);
    });

    it('returns false when name is missing', () => {
        const facetData = { subfacets: { 1: {} } };
        expect(isFacetDataValid(facetData, 'en')).toBe(false);
    });

    it('returns false when name exists but locale is missing', () => {
        const facetData = {
            name: { de: 'Test' },
            subfacets: { 1: {} },
        };
        expect(isFacetDataValid(facetData, 'en')).toBe(false);
    });

    it('returns false when subfacets required but missing', () => {
        const facetData = {
            name: { en: 'Test Facet' },
        };
        expect(isFacetDataValid(facetData, 'en', true)).toBe(false);
    });
});

describe('findEventTypeByCode', () => {
    const mockEventTypes = [
        { code: 'birth', name: 'Birth' },
        { code: 'death', name: 'Death' },
        { code: 'marriage', name: 'Marriage' },
    ];

    it('finds event type by code', () => {
        expect(findEventTypeByCode(mockEventTypes, 'birth')).toEqual({
            code: 'birth',
            name: 'Birth',
        });
    });

    it('returns null when event type not found', () => {
        expect(findEventTypeByCode(mockEventTypes, 'nonexistent')).toBeNull();
    });

    it('returns null for undefined eventTypes', () => {
        expect(findEventTypeByCode(undefined, 'birth')).toBeNull();
    });

    it('returns null for null eventTypes', () => {
        expect(findEventTypeByCode(null, 'birth')).toBeNull();
    });

    it('returns null for non-array eventTypes', () => {
        expect(findEventTypeByCode('not an array', 'birth')).toBeNull();
    });

    it('returns null for undefined code', () => {
        expect(findEventTypeByCode(mockEventTypes, undefined)).toBeNull();
    });

    it('returns null for null code', () => {
        expect(findEventTypeByCode(mockEventTypes, null)).toBeNull();
    });

    it('returns null when found event type has no name', () => {
        const eventTypesWithoutName = [{ code: 'birth' }];
        expect(findEventTypeByCode(eventTypesWithoutName, 'birth')).toBeNull();
    });
});
