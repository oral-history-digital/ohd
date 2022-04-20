import { t } from 'modules/i18n';

export default function queryToText(query, facets, locale, translations) {
    let queryText = '';

    for (let [key, value] of Object.entries(query)) {
        {
            if (key === 'sort' || key === 'order') {
                continue;
            }
            if (typeof value !== 'string' && !Array.isArray(value)) {
                continue;
            }

            const translatedKey = t({ locale, translations }, `search_facets.${key}`);
            const separator = queryText === '' ? '' : ' - ';
            queryText += `${separator}${translatedKey}: `;

            if (typeof value === 'string') {
                queryText += value;
            } else {
                // Array
                value.forEach((element, index) => {
                    const el = facets?.[key]?.['subfacets'][element];
                    const val = el ? el['name'][locale] : element;
                    const endElement = index === value.length - 1 ? '' : ', ';
                    queryText += `${val}${endElement}`;
                })
            }
        }
    }

    return queryText;
}
