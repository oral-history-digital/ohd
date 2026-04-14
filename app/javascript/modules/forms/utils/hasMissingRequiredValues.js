/**
 * Checks whether a form has missing values for required elements.
 *
 * In this forms system, "required" is inferred by convention:
 * there is no dedicated `required` flag on elements.
 * A field is treated as required when it participates in validation
 * (`validate` exists) and is not explicitly marked as optional.
 *
 * A field is considered required when it:
 * - has an attribute
 * - is not hidden
 * - is not optional
 * - has a validate function
 *
 * @param {Array} elements - Form element definitions
 * @param {Object} values - Current form values
 * @returns {boolean} True when at least one required field is empty
 */
export function hasMissingRequiredValues(elements, values) {
    return elements.some((element) => {
        if (
            !element?.attribute ||
            element.hidden ||
            element.optional ||
            typeof element.validate !== 'function'
        ) {
            return false;
        }

        const currentValue =
            values[element.attribute] !== undefined
                ? values[element.attribute]
                : element.value;

        if (Array.isArray(currentValue)) {
            return currentValue.length === 0;
        }

        return (
            currentValue === undefined ||
            currentValue === null ||
            currentValue === ''
        );
    });
}
