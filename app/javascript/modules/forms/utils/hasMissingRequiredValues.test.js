import { hasMissingRequiredValues } from './hasMissingRequiredValues';

describe('hasMissingRequiredValues', () => {
    const requiredValidate = (v) => Boolean(v);

    it('returns false when there are no elements', () => {
        expect(hasMissingRequiredValues([], {})).toBe(false);
    });

    it('returns true for missing required value', () => {
        const elements = [
            {
                attribute: 'email',
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, {})).toBe(true);
    });

    it('returns true for null required value', () => {
        const elements = [
            {
                attribute: 'email',
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, { email: null })).toBe(true);
    });

    it('returns true for empty-string required value', () => {
        const elements = [
            {
                attribute: 'email',
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, { email: '' })).toBe(true);
    });

    it('returns true for empty required array value', () => {
        const elements = [
            {
                attribute: 'roles',
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, { roles: [] })).toBe(true);
    });

    it('returns false for non-empty required array value', () => {
        const elements = [
            {
                attribute: 'roles',
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, { roles: ['admin'] })).toBe(
            false
        );
    });

    it('returns false for optional field without value', () => {
        const elements = [
            {
                attribute: 'notes',
                optional: true,
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, {})).toBe(false);
    });

    it('returns false for hidden field without value', () => {
        const elements = [
            {
                attribute: 'zipcode',
                hidden: true,
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, {})).toBe(false);
    });

    it('returns false for field without validate function', () => {
        const elements = [
            {
                attribute: 'email',
            },
        ];

        expect(hasMissingRequiredValues(elements, {})).toBe(false);
    });

    it('uses element value as fallback when form values are undefined', () => {
        const elements = [
            {
                attribute: 'email',
                value: 'preset@example.org',
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, {})).toBe(false);
    });

    it('prefers explicit form value over element fallback value', () => {
        const elements = [
            {
                attribute: 'email',
                value: 'preset@example.org',
                validate: requiredValidate,
            },
        ];

        expect(hasMissingRequiredValues(elements, { email: '' })).toBe(true);
    });
});
