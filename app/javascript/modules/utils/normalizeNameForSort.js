/**
 * Normalize a name for sorting by lowercasing and ignoring leading punctuation/symbols
 * (including typographic quotes) so sort starts on letters/numbers.
 * This is used to make sorting by name more intuitive, e.g. so "Archiv" sorts before
 * "„Name“" and "“Apple”".
 *
 * @param {string} value - The name to normalize.
 * @returns {string} The normalized name for sorting.
 */
export default function normalizeNameForSort(value) {
    return (
        (value || '')
            .toLowerCase()
            // Ignore leading punctuation/symbols (including typographic quotes) so sort starts on letters/numbers.
            .replace(/^[\s"'`()[\]{}<>.,!?@#$%^&*+\-_=|\\/:;~„“”‚‘’«»‹›]+/, '')
    );
}
