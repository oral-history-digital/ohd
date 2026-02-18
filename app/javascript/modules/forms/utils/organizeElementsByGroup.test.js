import { organizeElementsByGroup } from './organizeElementsByGroup';

describe('organizeElementsByGroup', () => {
    it('returns empty array for empty elements', () => {
        const result = organizeElementsByGroup([]);
        expect(result).toEqual([]);
    });

    it('groups elements with the same group name', () => {
        const elements = [
            { attribute: 'first_name', group: 'personal' },
            { attribute: 'last_name', group: 'personal' },
        ];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            group: 'personal',
            elements: [
                { attribute: 'first_name', group: 'personal' },
                { attribute: 'last_name', group: 'personal' },
            ],
        });
    });

    it('creates individual rows for ungrouped elements with attribute names', () => {
        const elements = [{ attribute: 'email' }];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            group: 'single-email',
            elements: [{ attribute: 'email' }],
        });
    });

    it('handles ungrouped elements without attribute name', () => {
        const elements = [{ elementType: 'extra' }];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            group: 'single-element',
            elements: [{ elementType: 'extra' }],
        });
    });

    it('maintains first-appearance order for multiple groups', () => {
        const elements = [
            { attribute: 'first_name', group: 'personal' },
            { attribute: 'street', group: 'address' },
            { attribute: 'last_name', group: 'personal' },
            { attribute: 'city', group: 'address' },
        ];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(2);
        expect(result[0].group).toBe('personal');
        expect(result[1].group).toBe('address');
    });

    it('collects all elements of a group regardless of position', () => {
        const elements = [
            { attribute: 'first_name', group: 'personal' },
            { attribute: 'street', group: 'address' },
            { attribute: 'last_name', group: 'personal' },
        ];

        const result = organizeElementsByGroup(elements);

        const personalGroup = result.find((g) => g.group === 'personal');
        expect(personalGroup.elements).toHaveLength(2);
        expect(personalGroup.elements[0].attribute).toBe('first_name');
        expect(personalGroup.elements[1].attribute).toBe('last_name');
    });

    it('handles mix of grouped and ungrouped elements', () => {
        const elements = [
            { attribute: 'first_name', group: 'personal' },
            { attribute: 'last_name', group: 'personal' },
            { attribute: 'email' },
            { attribute: 'phone' },
        ];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(3);
        expect(result[0].group).toBe('personal');
        expect(result[1].group).toBe('single-email');
        expect(result[2].group).toBe('single-phone');
    });

    it('does not duplicate groups on repeated group names', () => {
        const elements = [
            { attribute: 'first_name', group: 'personal' },
            { attribute: 'last_name', group: 'personal' },
            { attribute: 'city', group: 'personal' },
        ];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(1);
        expect(result[0].elements).toHaveLength(3);
    });

    it('preserves element properties', () => {
        const elements = [
            {
                attribute: 'email',
                group: 'contact',
                type: 'email',
                validate: (v) => v.includes('@'),
            },
            {
                attribute: 'phone',
                group: 'contact',
                type: 'tel',
            },
        ];

        const result = organizeElementsByGroup(elements);

        expect(result[0].elements[0].type).toBe('email');
        expect(result[0].elements[0].validate).toBeDefined();
        expect(result[0].elements[1].type).toBe('tel');
    });

    it('handles elements with empty group string', () => {
        const elements = [{ attribute: 'field', group: '' }];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(1);
        expect(result[0].group).toBe('');
    });

    it('handles null/undefined in element properties', () => {
        const elements = [
            { attribute: 'name', group: 'info', value: null },
            { group: 'info', value: undefined },
        ];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(1);
        expect(result[0].elements).toHaveLength(2);
    });

    it('creates separate ungrouped rows for each ungrouped element', () => {
        const elements = [
            { attribute: 'email' },
            { attribute: 'phone' },
            { attribute: 'website' },
        ];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(3);
        expect(result[0].group).toBe('single-email');
        expect(result[1].group).toBe('single-phone');
        expect(result[2].group).toBe('single-website');
    });

    it('handles real-world form scenario', () => {
        const elements = [
            { attribute: 'first_name', group: 'personal' },
            { attribute: 'last_name', group: 'personal' },
            { attribute: 'street', group: 'address' },
            { attribute: 'zipcode', group: 'address' },
            { attribute: 'city', group: 'address' },
            { attribute: 'email' },
            { attribute: 'newsletter_consent' },
        ];

        const result = organizeElementsByGroup(elements);

        expect(result).toHaveLength(4);
        expect(result[0]).toEqual(
            expect.objectContaining({ group: 'personal' })
        );
        expect(result[1]).toEqual(
            expect.objectContaining({ group: 'address' })
        );
        expect(result[2]).toEqual(
            expect.objectContaining({ group: 'single-email' })
        );
        expect(result[3]).toEqual(
            expect.objectContaining({
                group: 'single-newsletter_consent',
            })
        );
    });
});
