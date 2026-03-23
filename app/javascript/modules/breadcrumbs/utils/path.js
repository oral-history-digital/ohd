/**
 * Converts route-style segment names into readable labels.
 */
export function humanizeSegment(segment) {
    if (!segment) {
        return null;
    }

    return segment
        .split('_')
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

/**
 * Joins a base path and suffix into a normalized URL path.
 */
export function joinPath(basePath, suffix = '') {
    if (!basePath) {
        return suffix || null;
    }

    if (!suffix) {
        return basePath;
    }

    const normalizedBase = basePath.endsWith('/')
        ? basePath.slice(0, -1)
        : basePath;
    const normalizedSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;

    return `${normalizedBase}${normalizedSuffix}`;
}
