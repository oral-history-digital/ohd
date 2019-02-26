export function get(state, dataType, id) {
    return state.data[dataType][id]
}

export function getInterview(state) {
    return state.data.interviews && state.data.interviews[state.archive.archiveId];
}

export function segments(props) {
    return props.interview && props.interview.segments && props.interview.segments[props.tape] || {};
}

export function activeSegment(time, props) {

    let found = false;
    let sortedSegments = Object.values(segments(props)).sort(function(a, b) {a.time - b.time})
    //
    // aproximation based on the asumption that the mean or median segment duration is 7s
    //
    let index = Math.round(time/7);
    let firstSegment = sortedSegments[0];
    let lastSegment = sortedSegments[sortedSegments.length - 1];

    if(!firstSegment){
        return null;
    }

    if (index === 0) {
        return firstSegment;
    }

    if (index >= sortedSegments.length) {
        index = sortedSegments.length - 1;
    }

    if (sortedSegments[index].time > time) {
        while (!found) {
            if (
                sortedSegments[index].time <= time ||
                index === 0
            ) {
                found = true;
                break;
            }
            index--;
        }
    } else if (sortedSegments[index].time < time) {
        while (!found) {
            if (
                sortedSegments[index].time >= time ||
                index === sortedSegments.length - 1
            ) {
                found = true;
                break;
            }
            index++;
        }
    }

    return sortedSegments[index];
}

export function getInterviewee(props) {
    if (props.interview && props.people && props.contributionTypes) {
        for(var c in props.interview.contributions) {
            if (props.interview.contributions[c].contribution_type === props.contributionTypes.interviewee)
                return props.people[props.interview.contributions[c].person_id];
        }
    }
}

export function t(props, key) {
    let text;
    let keyArray;
    let cmd = `text = props.translations.${props.locale}.${key}`
    try{
        eval(cmd);
    } catch (e) {
        // text = `translation for ${props.locale}.${key} is missing!`;
        keyArray = key.split('.')
        text = keyArray[keyArray.length - 1]
    } finally {
        if (typeof(text) === 'string') {
            return text 
        } else {
            // return `translation for ${props.locale}.${key} is missing!`;
            keyArray = key ? key.split('.') : [];
            text = keyArray[keyArray.length - 1];
            return text;
        }
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

export function pluralize(word) {
    // TODO: fit this to all upcase words like PERSON
    // or be aware that you have to upcase later!
    //
    let pluralizedWord;
    if (word.toLowerCase() === 'person') 
        pluralizedWord = word[0] + 'eople';
    else if (word[word.length - 1] === 'y')
        pluralizedWord = word.slice(0, -1) + 'ies'
    else
        pluralizedWord = word + 's';

    return pluralizedWord;
}

export function loggedIn(props) {
    return !props.authStatus.isLoggedOut && props.account.email;
}

export function admin(props, obj) {
    if (props.account && props.editView && (props.account.admin || props.account.permissions)) {
        if (
            props.account.admin ||
            (props.account.permissions && props.account.permissions.filter(permission => permission.controller === obj.type && permission.action === obj.action).length > 0) ||
            (props.account.tasks && props.account.tasks.filter(task => task.authorized_type === obj.type && task.authorized_id === obj.id).length > 0)
        ) {
            return true;
        }
    } else {
        return false;
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
            if (value.length) {
                let key = t(props, 'search_facets.' + k.replace('[]',''));
                let nextElement = queryText == "" ? "" : " - "
                queryText = queryText + nextElement + key + ": ";
                if (Array.isArray(value)) {
                    value.forEach(function (element, index) {
                        let val = props.facets[k.replace('[]','')]['subfacets'][element]['name'][props.locale]
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
