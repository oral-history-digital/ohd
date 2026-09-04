/**
 * Converts a query object into a URL query string with sorted keys.
 *
 * @param {Object} query - The query object to convert.
 * @returns {string} The URL query string representation of the query object.
 *
 * Example:
 * const query = { page: 2, scope: 'projects' };
 * const queryString = parametrizedQuery(query);
 * console.log(queryString); // Output: "page=2&scope=projects"
 */
export function parametrizedQuery(query) {
    return Object.keys(query)
        .sort()
        .map((key) => {
            return `${key}=${query[key]}`;
        })
        .join('&');
}
