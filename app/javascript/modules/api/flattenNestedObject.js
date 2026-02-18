/**
 * Flattens a nested object into Rails-style bracket notation form fields.
 * Handles 2-level and 3-level nesting (e.g., access_config[organization_setter][display]).
 *
 * @param {Object} req - The superagent request object
 * @param {string} scope - The top-level scope (e.g., 'access_config')
 * @param {string} param - The parameter name (e.g., 'organization_setter')
 * @param {Object} value - The nested object to flatten
 */
export function flattenNestedObject(req, scope, param, value) {
    Object.keys(value).forEach((nestedKey) => {
        const nestedValue = value[nestedKey];

        if (
            typeof nestedValue === 'object' &&
            !Array.isArray(nestedValue) &&
            nestedValue !== null
        ) {
            // Handle deeper nesting (e.g., values hash)
            Object.keys(nestedValue).forEach((deepKey) => {
                if (
                    nestedValue[deepKey] !== null &&
                    nestedValue[deepKey] !== undefined
                ) {
                    req.field(
                        `${scope}[${param}][${nestedKey}][${deepKey}]`,
                        nestedValue[deepKey]
                    );
                }
            });
        } else if (nestedValue !== null && nestedValue !== undefined) {
            // Simple nested value
            req.field(`${scope}[${param}][${nestedKey}]`, nestedValue);
        }
    });
}
