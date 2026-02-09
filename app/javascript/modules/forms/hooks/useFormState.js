import { useState } from 'react';

import { pluralize } from 'modules/strings';

/**
 * Custom hook for managing form state including regular fields and nested collections.
 *
 * This hook centralizes all form state management logic that was previously inline
 * in the Form component. It handles:
 * - Regular field values and validation errors
 * - Nested collections with Rails-style _attributes suffix
 * - Complex nested object merging and deletion
 *
 * @param {Object} initialValues - Initial form field values
 * @param {Object} data - Existing data object (for edit forms)
 * @param {Array} elements - Form element configuration array
 * @returns {Object} Form state and manipulation functions
 */
export function useFormState(initialValues, data, elements) {
    const [values, setValues] = useState(initValues());
    const [errors, setErrors] = useState(initErrors());
    const [touched, setTouched] = useState({});

    /**
     * Initialize form values from initialValues and data props.
     * For Interview entities, uses archive_id instead of id.
     */
    function initValues() {
        const values = { ...initialValues };
        if (data) {
            // Merge all data properties into form values for editing
            // Skip internal metadata and nested attributes (handled separately)
            Object.keys(data).forEach((key) => {
                if (!['type', 'translations_attributes'].includes(key)) {
                    values[key] = data[key];
                }
            });
            // Ensure correct ID format for Interviews
            values.id = data.type === 'Interview' ? data.archive_id : data.id;
        }
        return values;
    }

    /**
     * Check if a form element has a validation error.
     * Handles both single-locale and multi-locale fields.
     */
    function hasError(element) {
        let error = false;
        if (typeof element.validate === 'function') {
            const elementValues = (
                (data?.translations_attributes &&
                    Object.values(data.translations_attributes)) ||
                []
            )
                .concat(
                    (values?.translations_attributes &&
                        Object.values(values.translations_attributes)) ||
                        []
                )
                .map((t) => t[element.attribute]);
            const elementValue =
                element.value ||
                values?.[element.attribute] ||
                data?.[element.attribute];
            error = element.multiLocale
                ? !elementValues?.some((value) => element.validate(value))
                : !(elementValue && element.validate(elementValue));
        }
        return error;
    }

    /**
     * Initialize error state for all form elements.
     * Errors are only tracked, but not shown until fields are touched or form is submitted.
     */
    function initErrors() {
        let errors = {};
        elements.map((element) => {
            const error = hasError(element);
            if (element.attribute) errors[element.attribute] = error;
        });
        return errors;
    }

    /**
     * Mark a field as touched by the user.
     */
    function touchField(name) {
        if (name !== 'undefined') {
            setTouched((prevTouched) => ({
                ...prevTouched,
                [name]: true,
            }));
        }
    }

    /**
     * Mark all fields as touched (used on form submission attempt).
     */
    function touchAllFields() {
        const allTouched = {};
        elements.forEach((element) => {
            if (element.attribute) {
                allTouched[element.attribute] = true;
            }
        });
        setTouched(allTouched);
    }

    /**
     * Update error state for a specific field.
     */
    function handleErrors(name, hasError) {
        if (name !== 'undefined') {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: hasError,
            }));
        }
    }

    /**
     * Update a regular form field value.
     * For nested form updates, use writeNestedObject instead.
     */
    function updateField(name, value) {
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }

    /**
     * Validate all form fields.
     * Returns true if form is valid, false if there are errors.
     */
    function valid() {
        let hasErrors = false;

        Object.keys(errors).forEach((name) => {
            if (name !== 'undefined') {
                const element = elements.find(
                    (element) => element.attribute === name
                );

                const isHidden = element?.hidden;
                const isOptional = element?.optional;

                const error = hasError(element);

                hasErrors = hasErrors || (!isHidden && !isOptional && error);
            }
        });

        return !hasErrors;
    }

    /**
     * Convert a scope name to Rails nested attributes format.
     * Example: "event" -> "events_attributes"
     */
    function nestedRailsScopeName(scope) {
        return `${pluralize(scope)}_attributes`;
    }

    /**
     * Write or update a nested object in the form values.
     * Handles both creating new nested items and updating existing ones.
     *
     * @param {Object} params - Object with scope as key and nested data as value
     * @param {string} identifier - Field to match on (default: 'id', use 'locale' for translations)
     * @param {number} index - Optional explicit index position
     */
    function writeNestedObject(params, identifier, index) {
        // For translations identifier is 'locale' to not multiply translations
        identifier ||= 'id';
        let nestedScope = Object.keys(params)[0];
        let nestedObject = params[nestedScope];
        let nestedObjects = values[nestedRailsScopeName(nestedScope)] || [];

        if (index === undefined) {
            index = nestedObjects.findIndex(
                (t) =>
                    nestedObject[identifier] &&
                    t[identifier] === nestedObject[identifier]
            );
        }
        index = index === -1 ? nestedObjects.length : index;

        setValues((prevValues) => ({
            ...prevValues,
            [nestedRailsScopeName(nestedScope)]: nestedObjects
                .slice(0, index)
                .concat([Object.assign({}, nestedObjects[index], nestedObject)])
                .concat(nestedObjects.slice(index + 1)),
        }));
    }

    /**
     * Delete a nested object from the form values.
     *
     * @param {number} index - Array index of item to delete
     * @param {string} scope - Scope name (will be converted to Rails _attributes format)
     */
    function deleteNestedObject(index, scope) {
        let nestedObjects = values[nestedRailsScopeName(scope)];

        setValues((prevValues) => ({
            ...prevValues,
            [nestedRailsScopeName(scope)]: nestedObjects
                .slice(0, index)
                .concat(nestedObjects.slice(index + 1)),
        }));
    }

    /**
     * Get nested objects for a specific scope.
     * Returns array of nested items or empty array.
     *
     * @param {string} scope - Scope name
     * @returns {Array} Array of nested objects
     */
    function getNestedObjects(scope) {
        return values[nestedRailsScopeName(scope)] || [];
    }

    /**
     * Replace all nested form values for a scope.
     * Used for bulk updates/reordering.
     *
     * @param {string} nestedScopeName - Rails-formatted scope name (with _attributes)
     * @param {Array} nestedScopeValues - New array of nested values
     */
    function replaceNestedFormValues(nestedScopeName, nestedScopeValues) {
        setValues((prevValues) => ({
            ...prevValues,
            [nestedScopeName]: nestedScopeValues,
        }));
    }

    return {
        values,
        errors,
        touched,
        updateField,
        handleErrors,
        touchField,
        touchAllFields,
        valid,
        writeNestedObject,
        deleteNestedObject,
        getNestedObjects,
        replaceNestedFormValues,
    };
}
