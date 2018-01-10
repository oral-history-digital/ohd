var ArchiveUtils = {
    getInterview: function (state) {
        return state.archive.interviews[state.archive.archiveId];
    },

    getLocationsForInterview: function (state) {
        return state.locations[state.archive.archiveId];
    },

    translate: function (props, key) {
        return props.translations && props.translations[props.locale] && props.translations[props.locale][key];
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


