import { t } from 'modules/i18n';

export default function queryToTitle(query, facetStructure, locale, translations) {
    const searchTerm = query.fulltext;

    const facets = { ...query };
    delete facets.fulltext;
    delete facets.sort;
    delete facets.order;

    const facetValues = Object.values(facets).flat();
    const numFacets = facetValues.length;

    if (searchTerm) {
        if (numFacets === 0) {
            return t({ locale, translations }, 'modules.workbook.default_titles.search_for_term',
                { searchTerm });
        } else {
            return t({ locale, translations }, 'modules.workbook.default_titles.search_for_term_and_filters',
                { searchTerm, numFilters: numFacets });
        }
    } else {
        let translatedFacetValues = [];

        for (let [facetName, facetValue] of Object.entries(facets)) {
            if (Array.isArray(facetValue)) {
                // References
                facetValue.forEach((value) => {
                    const valueObject = facetStructure?.[facetName]?.['subfacets']?.[value];
                    const translatedValue = valueObject ? valueObject['name'][locale] : value;
                    translatedFacetValues.push(translatedValue);
                })
            } else {
                // Date range
                // TODO: Prefix with translated facet name, e.g.
                // "Geburtsdatum 1970-1980" instead of "1970-1980"
                const formattedDateRange = facetValue.replace('-', '–');

                translatedFacetValues.push(formattedDateRange);
            }
        }

        const filterStr = t({ locale, translations }, 'modules.workbook.filter');
        if (translatedFacetValues.length === 1) {
            return `${filterStr} ${translatedFacetValues[0]}`;
        } else if (translatedFacetValues.length === 2) {
            return `${filterStr} ${translatedFacetValues[0]}, ${translatedFacetValues[1]}`;
        } else {
            const moreNum = numFacets - 2;
            return `${filterStr} ${translatedFacetValues[0]}, ${translatedFacetValues[1]} ${t({ locale, translations }, 'modules.workbook.default_titles.and_filters_more', { numFilters: moreNum })}`;
        }
    }
}
