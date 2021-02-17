import { t } from 'modules/i18n';

export function humanReadable(obj, attribute, props, state, none='---') {
    let translation = obj.translations && obj.translations.find(t => t.locale === props.locale)
    let value = state.value || obj[attribute] || (translation && translation[attribute]);

    if (props.optionsScope && props.translations[props.locale][props.optionsScope].hasOwnProperty(value))
        value = t(props, `${props.optionsScope}.${value}`);

    if (props.translations[props.locale][attribute] && props.translations[props.locale][attribute].hasOwnProperty(value))
        value = t(props, `${attribute}.${value}`);

    if (props.translations[props.locale].hasOwnProperty(value))
        value = t(props, value);

    if (/\w+_id/.test(attribute) && attribute !== 'archive_id') // get corresponding name from e.g. collection_id
        value = props.values[value] && props.values[value].name

    if (typeof value === 'object' && value !== null)
        value = value[props.locale]

    if (typeof value === 'string' && state.collapsed)
        value = value.substring(0,25)

    return value || none;
}

export function loadIntervieweeWithAssociations(props) {
    let intervieweeContribution = Object.values(props.interview.contributions).find(c => c.contribution_type === 'interviewee');
    let intervieweeId = intervieweeContribution && intervieweeContribution.person_id;
    let interviewee = props.people[intervieweeId]
    if (
           ((interviewee && !interviewee.associations_loaded) || !interviewee) &&
           intervieweeId && !props.peopleStatus[intervieweeId]
    ) {
        props.fetchData(props, 'people', intervieweeId, null, 'with_associations=true');
    }
}

export function fullname(props, person, withBirthName=false, locale=props.locale) {
    if (person) {
        try {
            let name = `${person.names[locale].firstname} ${person.names[locale].lastname}`;
            let birthName = person.names[locale].birth_name;
            if (withBirthName && birthName)
                name += person.names[locale].birth_name;
            return name;
        } catch (e) {
            if(locale == 'de') {
                return ''
            }
            else {
                return fullname(props, person, false, 'de');
            }
        }
    }
}

export function parametrizedQuery(query) {
    return Object.keys(query).sort().map((key, index) => {
        return `${key}=${query[key]}`;
    }).join('&');
}

export function statifiedQuery(query) {
    return parametrizedQuery(query).replace(/[=&]/g, '_');
}

export function queryToText(query, props) {
    let queryText = "";
    for (let [k, value] of Object.entries(query)) {
        {
            if (value.length && props.facets) {
                let key = t(props, 'search_facets.' + k.replace('[]',''));
                let nextElement = queryText == "" ? "" : " - "
                queryText = queryText + nextElement + key + ": ";
                if (Array.isArray(value)) {
                    value.forEach(function (element, index) {
                        let el = props.facets[k.replace('[]','')] && props.facets[k.replace('[]','')]['subfacets'][element]
                        let val = el ? el['name'][props.locale] : ''
                        // let locale_element = (element + '').toLowerCase().split().join('_')
                        // val = val || t(props, 'search_facets')[locale_element];
                        // val = val || locale_element
                        let endElement = index == value.length - 1 ? "" : ", "
                        queryText = queryText + " " + val + endElement;
                    })
                } else {
                    queryText = queryText + " " + value
                }
            }
        }
    }
    return queryText;
}
