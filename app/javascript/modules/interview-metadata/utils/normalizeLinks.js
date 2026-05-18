/**
 * Normalizes the links input to ensure it is always an array of strings, regardless of whether the input is a string or an array.
 * @param {*} links - The input links, which can be a string (with links separated by newlines or commas) or an array of strings.
 * @returns {string[]} - An array of normalized links.
 */
export function normalizeLinks(links) {
    const normalizedLinks = Array.isArray(links)
        ? links
        : typeof links === 'string'
          ? links
                .split(/[\r\n,]+/) // split by newlines and commas
                .map((link) => link.trim())
                .filter(Boolean)
          : [];
    return normalizedLinks;
}

export default normalizeLinks;
