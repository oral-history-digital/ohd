export function get(state, dataType, id) {
    return state.data[dataType][id]
}

export function getInterview(state) {
    return state.data.interviews && state.data.interviews[state.archive.archiveId];
}

export function segments(props) {
    return props.interview && props.interview.segments && props.interview.segments[props.tape] || {};
}

export function getSegmentId(time, segments, lastSegmentId, firstSegmentId) {

    let found = false;
    //
    // aproximation based on the asumption that the mean or median segment duration is 7s
    //
    let segmentId = firstSegmentId + Math.round(time/7);
    if (segmentId > lastSegmentId)
        segmentId = lastSegmentId;

    if (segments[segmentId].start_time > time) {
        while (!found) {
            if (
                segments[segmentId].start_time <= time ||
                segmentId === firstSegmentId
            ) {
                found = true;
                break;
            }
            segmentId--;
        }
    } else if (segments[segmentId].start_time < time) {
        while (!found) {
            if (
                segments[segmentId].start_time >= time ||
                segmentId === lastSegmentId
            ) {
                found = true;
                break;
            }
            segmentId++;
        }
    }

    return segmentId;
}

export function t(props, key) {
    let text;
    let cmd = `text = props.translations.${props.locale}.${key}`
    try{
        eval(cmd);
    } catch (e) {
        text = `translation for ${props.locale}.${key} is missing!`;
    } finally {
        if (typeof(text) === 'string') {
            return text 
        } else {
            return `translation for ${props.locale}.${key} is missing!`;
        }
    }
}

export function fullname(props, person, withBirthName=false) {
    if (person) {
        try {
            let name = `${person.names[props.locale].firstname} ${person.names[props.locale].lastname}`;
            let birthName = person.names[props.locale].birth_name;
            if (withBirthName && birthName)
                name += person.names[props.locale].birth_name;
            return name;
        } catch (e) {
            return `person ${person.id} has no name(s) in ${props.locale}`;
        }
    }
}

export function pluralize(word) {
    let pluralizedWord;
    switch(word) {
        case 'person':
            pluralizedWord = 'people';
            break;
        // TODO: unify words ending on y
        case 'history': 
            pluralizedWord = 'histories';
            break;
        case 'registry_entry': 
            pluralizedWord = 'registry_entries';
            break;
        default:
            pluralizedWord = `${word}s`;
    }

    return pluralizedWord;
}

export function admin(props) {
    if (props.account && props.account.admin && props.editView) {
        return true;
    } else {
        return false;
    }
}

export function queryToText(query, props) {
    let queryText = "";
    for (let [k, value] of Object.entries(query)) {
        {
            if (value.length) {
                let key = t(props, 'search_facets.' + k.replace('[]',''));
                let nextElement = queryText == "" ? "" : " - "
                queryText = queryText + nextElement + key + ": ";
                if (Array.isArray(value)) {
                    value.forEach(function (element, index) {
                        let val = props.facets[k.replace('[]','')]['subfacets'][element]['descriptor'][props.locale]
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
