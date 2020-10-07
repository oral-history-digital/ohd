export function pathBase(props) {
    //return `/${props.projectId}/${props.locale}`;
    return `/${props.locale}`;
}

export function get(state, dataType, id) {
    return state.data[dataType][id]
}

export function getProject(state) {
    //return state.data.projects && state.data.projects.filter(project => {return project.identifier === state.archive.projectId});
    if (state.archive.projectId && Object.keys(state.data.projects).length > 0) {
        let project;
        for (var projectId in state.data.projects) {
            if (state.data.projects[projectId].identifier === state.archive.projectId) {
                project = state.data.projects[projectId];
            }
            return project;
        };
    } else {
        return null;
    }
}

export function getInterview(state) {
    return state.data.interviews && state.data.interviews[state.archive.archiveId];
}

export function humanReadable(obj, attribute, props, state, none='---') {
    let translation = obj.translations && obj.translations.find(t => t.locale === props.locale)
    let value = state.value || obj[attribute] || (translation && translation[attribute]);

    if (props.optionsScope && props.translations[props.locale][props.optionsScope].hasOwnProperty(value)) 
        value = t(props, `${props.optionsScope}.${value}`);

    if (props.translations[props.locale][attribute] && props.translations[props.locale][attribute].hasOwnProperty(value)) 
        value = t(props, `${attribute}.${value}`);

    if (/\w+_id/.test(attribute) && attribute !== 'archive_id') // get corresponding name from e.g. collection_id
        value = props.values[value] && props.values[value].name

    if (typeof value === 'object' && value !== null)
        value = value[props.locale]

    if (typeof value === 'string' && state.collapsed) 
        value = value.substring(0,25)

    return value || none;
}

export function segments(props) {
    return props.interview && props.interview.segments && props.interview.segments[props.tape] || {};
}


export function sortedSegmentsForTape(props, tape) {
    let sorted = [];
    if (props.interview && Object.keys(props.interview.segments).length > 0) {
        sorted = Object.values(props.interview.segments[tape]).sort((a, b) =>{return a.time - b.time})
    }
    return sorted;
}

export function sortedSegmentsWithActiveIndexForTape(time, props) {

    let found = false;
    //let sortedSegments = Object.values(segments(props)).sort(function(a, b) {return a.time - b.time})
    let sorted = sortedSegmentsForTape(props, props.tape);
    //
    // aproximation based on the asumption that the mean or median segment duration is 7s
    //
    let index = Math.round(time/7);
    let firstSegment = sorted[0];
    let lastSegment = sorted[sorted.length - 1];

    if(!firstSegment){
        return [null, sorted, 0];
    }

    if (index === 0) {
        return [firstSegment, sorted, index];
    }

    if (index >= sorted.length) {
        index = sorted.length - 1;
    }

    if (sorted[index].time > time) {
        while (!found) {
            if (
                (sorted[index].time <= time) ||
                index === 0
            ) {
                found = true;
                break;
            }
            index--;
        }
    } else if (sorted[index].time < time) {
        while (!found) {
            if (
                (sorted[index].time >= time) ||
                index === sorted.length - 1
            ) {
                found = true;
                break;
            }
            index++;
        }
    }

    return [sorted[index], sorted, index];
}

export function sortedSegmentsWithActiveIndex(time, props) {
    let sortedSegments = [];
    let index = 0;
    let activeSegment = null;

    if (props.interview && Object.keys(props.interview.first_segments_ids).length > 0) {
        for (var i=1; i<= parseInt(props.interview.tape_count); i++) { 
            if (props.tape === i) {
                let sortedWActiveAIndex = sortedSegmentsWithActiveIndexForTape(time, props);
                index = sortedSegments.length + sortedWActiveAIndex[2];
                sortedSegments = sortedSegments.concat(sortedWActiveAIndex[1]);
                activeSegment = sortedWActiveAIndex[0];
            } else if (props.interview.segments[i]) {
                sortedSegments = sortedSegments.concat(Object.values(props.interview.segments[i]).sort((a, b) =>{return a.time - b.time}))
            }
        }
    }

    let l = sortedSegments.length;
    return [activeSegment, sortedSegments, index];
}

export function getInterviewee(props) {
    if (props.interview && props.interview.contributions && props.people) {
        let intervieweeContribution = Object.values(props.interview.contributions).find(c => c.contribution_type === 'interviewee');
        return props.people[intervieweeContribution && intervieweeContribution.person_id]
    }
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

export function t(props, key, params) {
    let text, defaultKey;
    let keyArray = key.split('.');
    let productionFallback = keyArray[keyArray.length - 1];

    if (keyArray.length > 2) { 
        keyArray[keyArray.length - 2] = 'default';
        defaultKey = keyArray.join('.');
    }

    try {
        try {
            eval(`text = props.translations.${props.locale}.${key}`);
        } catch (e) {
        } finally {
            if (typeof(text) !== 'string') {
                eval(`text = props.translations.${props.locale}.${defaultKey}`);
            }
        }
    } catch (e) {
    } finally {
        if (typeof(text) === 'string') {
            if(params) {
                for (let [key, value] of Object.entries(params)) {
                    text = text.replace(`%{${key}}`, value)
                }
            }
            return text
        } else {
            if (developmentMode === 'true') {
                return `translation for ${props.locale}.${key} is missing!`;
            } else {
                return productionFallback;
            }
        }
    }
}

export function iOS() {
    // detect if user agent is iOS in order to exclude it from having a datalist
    // https://stackoverflow.com/a/9039885
    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    return iOS;
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

export function camelcase(str) {
    let s = str.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function underscore(str) {
    return str.split(/(?=[A-Z])/).join('_').toLowerCase();
}

// props should contain:
//   - account ~ state.data.accounts.current
//   - editView ~ state.archive.editView
//
// obj can be the serialized json of e.g. an interview or a segment
// 
// but obj can also be sth. like {type: 'Segment', id: 2345} or {type: 'UserRegistration', action: 'update'}
// so obj should contain a type and (id or action) 
//
export function admin(props, obj={}) {
    if (props.account && (props.editView || obj.type === 'Task')) {
        if (
            props.account.admin ||
            (obj.type && (obj.id || obj.action)) && (
                //
                // if obj is a task of current_user_account, he/she should be able to edit it 
                (props.account.tasks && obj.type === 'Task' && Object.values(props.account.tasks).filter(task => task.id === obj.id).length > 0) || 
                // if obj is a supervised task of current_user_account, he/she should be able to edit it 
                (props.account.supervised_tasks && obj.type === 'Task' && Object.values(props.account.supervised_tasks).filter(task => task.id === obj.id).length > 0) || 
                //
                // if obj.type and/or id correspond to some role or task, current_user_account should be able to edit it
                (props.account.permissions && Object.values(props.account.permissions).filter(permission => permission.klass === obj.type && permission.action_name === obj.action).length > 0) //||
                // to complicated at the moment
                //(props.account.tasks && Object.values(props.account.tasks).filter(task => task.authorized_type === obj.type && task.authorized_id === obj.id).length > 0) 
            )
        ) {
            return true;
        } else {
            return false;
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

export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return false;
}

export function getInterviewArchiveIdWithOffset(archiveId, foundInterviews, sortedArchiveIds, offset = 1) {
    if (foundInterviews && sortedArchiveIds) {
        let listOfArchiveIds = foundInterviews.map(x => x.archive_id);
        let positionInList = listOfArchiveIds.findIndex(i => i === archiveId)
        // use sortedArchiveIds if archiveId not in foundInterviews
        if (positionInList === -1) {
            listOfArchiveIds = sortedArchiveIds
            positionInList = sortedArchiveIds.findIndex(i => i === archiveId)
        }
        let offsetItem = listOfArchiveIds[positionInList + offset]
        if (listOfArchiveIds.length > 1 && positionInList > -1 && offsetItem) {
            return offsetItem
        } else {
            return false;
        }
    }
}

