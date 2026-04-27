import { getMergedTranslations } from './getMergedTranslations';

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
 * @param {Object} data - Existing persisted record data (edit forms)
 * @returns {boolean} True when at least one required field is empty
 */
export function hasMissingRequiredValues(elements, values, data) {
    return elements.some((element) => {
        if (
            !element?.attribute ||
            element.hidden ||
            element.optional ||
            typeof element.validate !== 'function'
        ) {
            return false;
        }

        if (element.multiLocale) {
            const translationValues = getMergedTranslations(data, values)
                .map((translation) => translation?.[element.attribute])
                .filter((value) => value !== undefined && value !== null);

            return !translationValues.some((value) => element.validate(value));
        }

        const hasExplicitFormValue = Object.prototype.hasOwnProperty.call(
            values || {},
            element.attribute
        );
        const hasPersistedValue =
            data &&
            Object.prototype.hasOwnProperty.call(data, element.attribute);

        const currentValue = hasExplicitFormValue
            ? values[element.attribute]
            : hasPersistedValue
              ? data[element.attribute]
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
