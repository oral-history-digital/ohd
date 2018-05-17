var ArchiveUtils = {
    getInterview: function (state) {
        return state.archive.interviews[state.archive.archiveId];
    },

    getLocationsForInterview: function (state) {
        return state.locations[state.archive.archiveId];
    },

    queryToText(query, props) {
        let queryText = "";
        for (let [k, value] of Object.entries(query)) {
            {
                if (value.length) {
                    let key = ArchiveUtils.translate(props, 'search_facets')[k];
                    let nextElement = queryText == "" ? "" : " - "
                    queryText = queryText + nextElement + key + ": ";
                    if (Array.isArray(value)) {
                        //TODO: find solution for ids
                        value.forEach(function (element, index) {
                            let locale_element = element.toLowerCase().split().join('_')
                            let val = ArchiveUtils.translate(props, 'search_facets')[locale_element];
                            val = val || locale_element
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


};

export default ArchiveUtils;

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

export function fullname(props, person) {
    if (person) {
        try {
            return `${person.names[props.locale].firstname} ${person.names[props.locale].lastname}`;
        } catch (e) {
            debugger;
            return `person ${person.id} has no name(s) in ${props.locale}`;
        }
    }
}
