/**
 * Remove a single query parameter from a path-like string.
 *
 * The input may be a relative path such as '/en/searches/archive?sort=random'
 * or any path/query string accepted by URLSearchParams.
 *
 * @param {string|null|undefined} path
 * @param {string} paramName
 * @returns {string|null|undefined}
 */
export function removeQueryParamFromPath(path, paramName) {
    if (!path) return path;

    const [pathname, queryString] = path.split('?');
    if (!queryString) return path;

    const params = new URLSearchParams(queryString);
    params.delete(paramName);
    const sanitizedQuery = params.toString();

    return sanitizedQuery ? `${pathname}?${sanitizedQuery}` : pathname;
}

/**
 * Sanitize internal return paths used for in-app navigation.
 *
 * It strips the internal checked_ohd_session handshake parameter and rejects
 * unsafe values (empty, non-relative, or protocol-relative paths).
 *
 * @param {string|null|undefined} path
 * @param {string|null} fallbackPath
 * @returns {string|null}
 */
export function sanitizeInternalReturnPath(path, fallbackPath = '/') {
    const sanitizedPath = removeQueryParamFromPath(path, 'checked_ohd_session');

    if (
        !sanitizedPath ||
        !sanitizedPath.startsWith('/') || // Ensure it's a relative path
        sanitizedPath.startsWith('//') // Prevent protocol-relative URLs
    ) {
        return fallbackPath;
    }

    return sanitizedPath;
}

/**
 * Build a path from pathname + search while removing internal session flags.
 *
 * @param {string} pathname
 * @param {string} search
 * @returns {string}
 */
export function pathWithoutInternalSessionFlag(pathname, search) {
    const params = new URLSearchParams(search);
    params.delete('checked_ohd_session');
    const sanitizedSearch = params.toString();

    return `${pathname}${sanitizedSearch ? `?${sanitizedSearch}` : ''}`;
}
