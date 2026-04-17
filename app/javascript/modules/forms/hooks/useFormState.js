import { useState } from 'react';

import { useI18n } from 'modules/i18n';
import { pluralize } from 'modules/strings';

import { hasMissingRequiredValues } from '../utils';

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
export function useFormState(
    initialValues,
    data,
    elements,
    {
        fetching = false,
        hasValidationErrors = false,
        submitted = false,
        disableIfUnchanged = false,
    } = {}
) {
    const [values, setValues] = useState(initValues());
    const [errors, setErrors] = useState(initErrors());
    const [touched, setTouched] = useState(initTouched());
    const [initialFormValues, setInitialFormValues] = useState(initValues());
    const { t } = useI18n();

    /**
     * Initialize form values from initialValues and data props.
     * For Interview entities, uses archive_id instead of id.
     */
    function initValues() {
        let values = { ...initialValues };

        // If no initial values provided, extract from data based on elements
        if (!initialValues && data && elements) {
            elements.forEach((element) => {
                if (
                    element.attribute &&
                    data[element.attribute] !== undefined
                ) {
                    values[element.attribute] = data[element.attribute];
                }
            });
        }

        // Ensure correct ID format for Interviews
        if (data) {
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
     * Initialize touched state for form elements.
     * Fields with touchOnInvalid=true will be marked as touched if they have validation errors.
     */
    function initTouched() {
        let touched = {};
        elements.forEach((element) => {
            if (element.attribute && element.touchOnInvalid) {
                const error = hasError(element);
                if (error) {
                    touched[element.attribute] = true;
                }
            }
        });
        return touched;
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
     * Check if form has unsaved changes by comparing current values with initial values.
     * Returns an object with isDirty flag and array of changed field names.
     */
    function areValuesEqual(a, b) {
        if (a === b) {
            return true;
        }

        if (a == null || b == null) {
            return false;
        }

        // Handle arrays and objects with deep equality check
        if (Array.isArray(a) || Array.isArray(b)) {
            if (!Array.isArray(a) || !Array.isArray(b)) {
                return false;
            }

            if (a.length !== b.length) {
                return false;
            }

            return a.every((item, index) => areValuesEqual(item, b[index]));
        }

        if (typeof a === 'object' && typeof b === 'object') {
            const aKeys = Object.keys(a);
            const bKeys = Object.keys(b);

            if (aKeys.length !== bKeys.length) {
                return false;
            }

            return aKeys.every(
                (key) =>
                    Object.prototype.hasOwnProperty.call(b, key) &&
                    areValuesEqual(a[key], b[key])
            );
        }

        return false;
    }

    function getDirtyStateForValues(valuesToCheck = values) {
        const currentKeys = Object.keys(valuesToCheck).filter(
            (key) => key !== 'id'
        );
        const initialKeys = Object.keys(initialFormValues).filter(
            (key) => key !== 'id'
        );
        const allKeys = Array.from(new Set([...currentKeys, ...initialKeys]));

        const dirtyFields = [];

        allKeys.forEach((key) => {
            if (!areValuesEqual(valuesToCheck[key], initialFormValues[key])) {
                dirtyFields.push(key);
            }
        });

        return {
            isDirty: dirtyFields.length > 0,
            dirtyFields: dirtyFields,
        };
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
     * Returns true when at least one touched, relevant field is currently invalid.
     */
    function hasTouchedValidationErrors() {
        return elements.some((element) => {
            const attribute = element.attribute;

            if (!attribute || !touched[attribute]) {
                return false;
            }

            if (element.hidden || element.optional) {
                return false;
            }

            if (typeof element.validate !== 'function') {
                return Boolean(errors[attribute]);
            }

            return hasError(element);
        });
    }

    const hasMissingRequired = hasMissingRequiredValues(elements, values, data);
    const dirtyState = getDirtyStateForValues();

    /**
     * Computes the current submit button disabled state and help text.
     */
    function getSubmitButtonState() {
        if (fetching) {
            return { disabled: true, helpText: null };
        }

        if (hasValidationErrors || hasTouchedValidationErrors()) {
            return {
                disabled: true,
                helpText: t('edit.form.fix_validation_errors'),
            };
        }

        if (hasMissingRequired) {
            return {
                disabled: true,
                helpText: null,
            };
        }

        if (submitted && !valid()) {
            return {
                disabled: true,
                helpText: t('edit.form.fix_errors'),
            };
        }

        if (disableIfUnchanged && !dirtyState.isDirty) {
            return {
                disabled: true,
                helpText: t('edit.form.no_changes'),
            };
        }

        return { disabled: false, helpText: null };
    }

    const submitButtonState = getSubmitButtonState();

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

    /**
     * Mark current values as the clean baseline after a successful save.
     * This allows disableIfUnchanged forms to disable submit immediately.
     */
    function markCurrentValuesAsClean(nextValues = values) {
        setInitialFormValues({ ...nextValues });
    }

    return {
        values,
        errors,
        touched,
        isDirty: dirtyState.isDirty,
        dirtyFields: dirtyState.dirtyFields,
        updateField,
        handleErrors,
        touchField,
        touchAllFields,
        valid,
        writeNestedObject,
        deleteNestedObject,
        getNestedObjects,
        replaceNestedFormValues,
        markCurrentValuesAsClean,
        getDirtyStateForValues,
        hasMissingRequired,
        submitButtonState,
    };
}
