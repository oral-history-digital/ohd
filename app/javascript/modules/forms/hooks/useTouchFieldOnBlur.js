/**
 * Custom hook that returns a blur handler for marking form fields as touched.
 * Used across multiple input components to track user interaction.
 *
 * @param {Function} touchField - Function to call with field name when blur occurs
 * @returns {Function} Blur event handler
 */
export function useTouchFieldOnBlur(touchField) {
    return (event) => {
        const name = event.target.name;
        if (typeof touchField === 'function') {
            touchField(name);
        }
    };
}
