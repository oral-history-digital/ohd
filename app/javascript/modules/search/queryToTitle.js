import { t } from 'modules/i18n';

export default function queryToTitle(query, facetStructure, locale, translations) {
    const searchTerm = query.fulltext;
    const facets = onlyFacetsQuery(query);
    const facetValues = Object.values(facets).flat();
    const numFilters = facetValues.length;

    if (searchTerm) {
        if (numFilters === 0) {
            return t({ locale, translations }, 'modules.workbook.default_titles.search_for_term',
                { searchTerm });
        } else {
            return t({ locale, translations }, 'modules.workbook.default_titles.search_for_term_and_filters',
                { searchTerm, numFilters });
        }
    } else {
        let translatedFacetValues = [];

        for (let [name, values] of Object.entries(facets)) {
            values.forEach((value) => {
                // TODO: Does not work for date facets yet.
                const valueObject = facetStructure?.[name]?.['subfacets']?.[value];
                const translatedValue = valueObject ? valueObject['name'][locale] : value;
                translatedFacetValues.push(translatedValue);
            })
        }

        const filterStr = t({ locale, translations }, 'modules.workbook.filter');
        if (translatedFacetValues.length === 1) {
            return `${filterStr} ${translatedFacetValues[0]}`;
        } else if (translatedFacetValues.length === 2) {
            return `${filterStr} ${translatedFacetValues[0]}, ${translatedFacetValues[1]}`;
        } else {
            const moreNum = numFilters - 2;
            return `${filterStr} ${translatedFacetValues[0]}, ${translatedFacetValues[1]} ${t({ locale, translations }, 'modules.workbook.default_titles.and_filters_more', { numFilters: moreNum })}`;
        }
    }
}

function onlyFacetsQuery(params) {
    const facets = {};

    for (let [name, values] of Object.entries(params)) {
        if (Array.isArray(values)) {
            facets[name] = values;
        }
    }

    return facets;
}
