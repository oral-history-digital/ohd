/**
 * Normalizes the selected files based on the `multiple` prop.
 * @param {File|File[]|null} value - The selected files value.
 * @param {boolean} multiple - Indicates if multiple files are allowed.
 * @returns {File[]} The normalized array of selected files.
 */
export function normalizeSelectedFiles(value, multiple) {
    if (multiple) return Array.isArray(value) ? value : [];
    return value instanceof File ? [value] : [];
}

/*
 * Normalizes the current files to an array.
 * @param {File|File[]|null} currentFiles - The current files value.
 * @returns {File[]} The normalized array of current files.
 */
export function normalizeCurrentFiles(currentFiles) {
    if (Array.isArray(currentFiles)) return currentFiles;
    return currentFiles ? [currentFiles] : [];
}
