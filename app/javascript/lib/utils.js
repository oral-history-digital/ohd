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

export function t(props, key, params) {
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
            if(params) {
                for (let [key, value] of Object.entries(params)) {
                    text = text.replace(`%{${key}}`, value)
                }
            }
            return text
        } else {
            // return `translation for ${props.locale}.${key} is missing!`;
            keyArray = key ? key.split('.') : [];
            text = keyArray[keyArray.length - 1];
            return text;
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
    str.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function loggedIn(props) {
    return !!(!props.authStatus.isLoggedOut && props.account.email);
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
    if (props.account && props.editView) {
        if (
            props.account.admin ||
            (obj.type && (obj.id || obj.action)) && (
                //
                // if obj is a task of current_user_account, he/she should be able to edit it 
                (props.account.tasks && obj.type === 'Task' && Object.values(props.account.tasks).filter(task => task.id === obj.id).length > 0) || 
                //
                // if obj.type and/or id correspond to some role or task, current_user_account should be able to edit it
                (props.account.permissions && Object.values(props.account.permissions).filter(permission => permission.klass === obj.type && permission.action_name === obj.action).length > 0) ||
                (props.account.tasks && Object.values(props.account.tasks).filter(task => task.authorized_type === obj.type && task.authorized_id === obj.id).length > 0) 
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
