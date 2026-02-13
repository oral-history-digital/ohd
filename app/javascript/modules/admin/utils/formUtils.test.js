/**
 * Tests for general form utilities
 */
import { getInitialFormValuesFromElements } from './formUtils';

describe('getInitialFormValuesFromElements', () => {
    it('should extract values from form elements', () => {
        const formElements = [
            {
                elementType: 'input',
                attribute: '[organization_setter]display',
                value: true,
            },
            {
                elementType: 'input',
                attribute: '[organization_setter]obligatory',
                value: false,
            },
        ];

        const result = getInitialFormValuesFromElements(formElements);

        expect(result).toEqual({
            '[organization_setter]display': true,
            '[organization_setter]obligatory': false,
        });
    });

    it('should ignore elements without attribute', () => {
        const formElements = [
            {
                elementType: 'extra',
                tag: 'h3',
            },
            {
                elementType: 'input',
                attribute: '[organization_setter]display',
                value: true,
            },
        ];

        const result = getInitialFormValuesFromElements(formElements);

        expect(result).toEqual({
            '[organization_setter]display': true,
        });
    });

    it('should ignore elements without value', () => {
        const formElements = [
            {
                elementType: 'input',
                attribute: 'name',
            },
            {
                elementType: 'input',
                attribute: '[organization_setter]display',
                value: true,
            },
        ];

        const result = getInitialFormValuesFromElements(formElements);

        expect(result).toEqual({
            '[organization_setter]display': true,
        });
    });

    it('should return undefined when no elements', () => {
        const result = getInitialFormValuesFromElements([]);

        expect(result).toBeUndefined();
    });

    it('should return undefined when formElements is null', () => {
        const result = getInitialFormValuesFromElements(null);

        expect(result).toBeUndefined();
    });

    it('should return undefined when formElements is undefined', () => {
        const result = getInitialFormValuesFromElements(undefined);

        expect(result).toBeUndefined();
    });

    it('should return undefined when no elements have values', () => {
        const formElements = [
            {
                elementType: 'extra',
                tag: 'h3',
            },
            {
                elementType: 'input',
                attribute: 'name',
            },
        ];

        const result = getInitialFormValuesFromElements(formElements);

        expect(result).toBeUndefined();
    });

    it('should handle value of false', () => {
        const formElements = [
            {
                elementType: 'input',
                attribute: '[organization_setter]display',
                value: false,
            },
        ];

        const result = getInitialFormValuesFromElements(formElements);

        expect(result).toEqual({
            '[organization_setter]display': false,
        });
    });

    it('should handle value of 0', () => {
        const formElements = [
            {
                elementType: 'input',
                attribute: 'count',
                value: 0,
            },
        ];

        const result = getInitialFormValuesFromElements(formElements);

        expect(result).toEqual({
            count: 0,
        });
    });

    it('should handle empty string value', () => {
        const formElements = [
            {
                elementType: 'input',
                attribute: 'name',
                value: '',
            },
        ];

        const result = getInitialFormValuesFromElements(formElements);

        expect(result).toEqual({
            name: '',
        });
    });
});
