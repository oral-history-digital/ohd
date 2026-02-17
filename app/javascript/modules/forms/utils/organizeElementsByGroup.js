/**
 * Organizes form elements by their group property, maintaining first-appearance order.
 * All elements are wrapped in form-row containers, either grouped or individually.
 * Elements without a group each get their own form-row.
 *
 * @param {Array} elements - Array of form element configurations
 * @returns {Array} Array of form-row containers with group metadata
 *
 * @example
 * const elements = [
 *   { attribute: 'first_name', group: 'personal' },
 *   { attribute: 'last_name', group: 'personal' },
 *   { attribute: 'email' }, // no group - gets its own row
 * ];
 * // Returns:
 * // [
 * //   { group: 'personal', elements: [first_name, last_name] },
 * //   { group: 'single-email', elements: [email] }
 * // ]
 */
export function organizeElementsByGroup(elements) {
    const organized = [];
    const seenGroups = new Set();

    elements.forEach((element) => {
        // Check for defined group (including empty string, but not null/undefined)
        if (
            element.group !== undefined &&
            element.group !== null &&
            !seenGroups.has(element.group)
        ) {
            // First appearance of this group - add all elements in this group
            const groupElements = elements.filter(
                (el) => el.group === element.group
            );
            organized.push({
                group: element.group,
                elements: groupElements,
            });
            seenGroups.add(element.group);
        } else if (element.group === undefined || element.group === null) {
            // No group - create individual form-row for this element
            // Use attribute name if available, otherwise use a fallback
            const groupName = element.attribute
                ? `single-${element.attribute}`
                : 'single-element';
            organized.push({
                group: groupName,
                elements: [element],
            });
        }
    });

    return organized;
}
