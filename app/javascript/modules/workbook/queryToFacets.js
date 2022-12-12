const matchYearRange = /^\d{4}-\d{4}$/;

export default function queryToFacets(query, facets, locale) {
    const clonedQuery = {...query};
    delete clonedQuery.sort;
    delete clonedQuery.order;
    delete clonedQuery.fulltext;

    let facetValues = [];

    for (let [key, value] of Object.entries(clonedQuery)) {
        if (Array.isArray(value)) {
            value.forEach(element => {
                const el = facets?.[key]?.['subfacets'][element];
                const val = el ? el['name'][locale] : element;
                facetValues.push(val);
            });
        } else if (typeof value === 'string' && matchYearRange.test(value)) {
            const formattedDateRange = value.replace('-', '–');
            facetValues.push(formattedDateRange);
        }
    }

    return facetValues.join(', ');
}
