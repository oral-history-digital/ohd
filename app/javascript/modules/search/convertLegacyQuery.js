export default function convertLegacyQuery(oldQuery) {
    const query = {};

    // Facets entries.
    for (let key in oldQuery) {
        const value = oldQuery[key];

        // Remove page entry.
        if (key === 'page') {
            continue;
        }

        // Handle year_of_birth.
        if (key === 'year_of_birth[]') {
            const years = value.map((year) => Number.parseInt(year));

            query.year_of_birth_min = Math.min(...years);
            query.year_of_birth_max = Math.max(...years);
            continue;
        }

        // Remove empty facets.
        if (value === null) {
            continue;
        }

        // Remove empty facets.
        if (Array.isArray(value) && value.length === 0) {
            continue;
        }

        // Remove [] at end of facet names.
        if (key.endsWith('[]')) {
            const newKey = key.slice(0, -2);
            query[newKey] = value;
            continue;
        }

        // Copy the rest.
        query[key] = value;
    }

    return query;
}
