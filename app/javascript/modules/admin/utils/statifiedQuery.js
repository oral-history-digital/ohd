import { parametrizedQuery } from './parametrizedQuery';

/**
 * Converts a query object into a statified query string.
 * @param {Object} query - The query object to convert.
 * @returns {string} The statified query string.
 *
 * Example:
 * const query = { page: 2, scope: 'projects' };
 * const statified = statifiedQuery(query);
 * console.log(statified); // Output: "page_2_scope_projects"
 */
export function statifiedQuery(query) {
    return parametrizedQuery(query).replace(/[=&]/g, '_');
}
