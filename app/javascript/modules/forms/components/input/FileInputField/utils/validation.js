/**
 * Normalizes the accept prop to an array of strings.
 * @param {string|string[]} accept - The accept prop.
 * @returns {string[]} The normalized accept array.
 */
export function normalizeAccept(accept) {
    if (Array.isArray(accept)) return accept;
    if (typeof accept === 'string') {
        return accept
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [];
}

/**
 * Checks if a file is accepted based on its type and the allowed file types.
 * @param {File} file - The file object to check.
 * @param {string|string[]} accept - The allowed file types.
 * @returns {boolean} True if the file is accepted, false otherwise.
 */
export function acceptsFile(file, accept) {
    const acceptedTypes = normalizeAccept(accept);
    if (acceptedTypes.length === 0) return true;

    const filename = file.name.toLowerCase();
    return acceptedTypes.some((acceptedType) => {
        const normalizedType = acceptedType.toLowerCase();
        if (normalizedType.startsWith('.')) {
            return filename.endsWith(normalizedType);
        }
        if (normalizedType.endsWith('/*')) {
            return file.type
                .toLowerCase()
                .startsWith(normalizedType.slice(0, -1));
        }

        return file.type.toLowerCase() === normalizedType;
    });
}

/**
 * Generates a unique identity string for a file based on its name, size, and last modified timestamp.
 * @param {File} file - The file object to generate an identity for.
 * @returns {string} A unique identity string for the file.
 */
export function fileIdentity(file) {
    return `${file.name}-${file.size}-${file.lastModified}`;
}

/**
 * Validates an array of files against the provided criteria.
 * @param {File[]} files - The array of files to validate.
 * @param {Object} options - Validation options.
 * @param {number} [options.currentFileCount=0] Number of persisted files that
 * count toward `maxFiles`.
 * @param {string|string[]} [options.accept] Allowed file types.
 * @param {number} [options.maxSize] Maximum allowed file size in bytes.
 * @param {number} [options.maxFiles] Maximum number of files allowed.
 * @returns {Object|null} An error object with `code` and `file` properties if
 * validation fails, or `null` if validation passes.
 */
export function validateFiles(
    files,
    { accept, maxSize, maxFiles, currentFileCount = 0 }
) {
    if (maxFiles && currentFileCount + files.length > maxFiles) {
        return { code: 'too_many_files', file: null };
    }

    for (const file of files) {
        // Check for empty files
        if (file.size === 0) return { code: 'empty_file', file };
        // Check for invalid file types
        if (!acceptsFile(file, accept)) {
            return { code: 'invalid_type', file };
        }
        // Check for files that exceed the maximum size
        if (maxSize && file.size > maxSize) {
            return { code: 'file_too_large', file };
        }
    }

    return null;
}
