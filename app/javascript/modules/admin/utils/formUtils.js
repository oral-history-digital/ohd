/**
 * General form utility functions
 */

/**
 * Extract initial form values from form elements.
 * Useful when form element definitions include initial values that need to be passed to FormComponent.
 *
 * @param {Array} formElements - Array of form element definitions
 * @returns {Object|undefined} Initial values object or undefined if no values found
 */
export function getInitialFormValuesFromElements(formElements) {
    if (!formElements || !Array.isArray(formElements)) {
        return undefined;
    }

    const computed = {};
    formElements.forEach((el) => {
        if (el.attribute && el.value !== undefined) {
            computed[el.attribute] = el.value;
        }
    });

    return Object.keys(computed).length > 0 ? computed : undefined;
}
