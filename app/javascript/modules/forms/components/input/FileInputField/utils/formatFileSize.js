/**
 * Formats a file size in bytes to a human-readable string.
 *
 * @param {number} size - The file size in bytes.
 * @returns {string|null} The formatted file size or null if the input is invalid.
 */
export function formatFileSize(size) {
    if (typeof size !== 'number') return null;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
