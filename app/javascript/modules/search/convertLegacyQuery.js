export default function convertLegacyQuery(oldQuery) {
    const query = {
        ...oldQuery,
    };

    // Delete page entry.
    delete query.page;

    // Facets entries.
    for (let key in query) {
        // Remove empty facets.
        if (query[key] === null) {
            delete query[key];
        }

        // Remove empty facets.
        if (Array.isArray(query[key]) && query[key].length === 0) {
            delete query[key];
        }

        // Remove [] at end of facet names.
        if (key.endsWith('[]')) {
            const newKey = key.slice(0, -2);
            query[newKey] = query[key];
            delete query[key];
        }
    }

    return query;
}
