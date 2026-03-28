/**
 * Filters collections by text query in collection name, institution name and notes.
 *
 * @param {Array} collections
 * @param {string} query
 * @returns {Array}
 */
export function filterCollections(collections, query) {
    if (!query) return collections;

    const lower = query.toLowerCase();

    return collections.filter((collection) => {
        return (
            collection.name?.toLowerCase().includes(lower) ||
            collection.institution?.name?.toLowerCase().includes(lower) ||
            collection.notes?.toLowerCase().includes(lower)
        );
    });
}
