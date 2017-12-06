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
        for (let [key, value] of Object.entries(query)) {
            {
                if (value.length) {
                    let nextElement = queryText == "" ? "" : " - "
                    queryText = queryText + nextElement + key + ": ";
                    if (Array.isArray(value)) {
                        value.forEach(function (element, index) {
                            let endElement = index == value.length - 1 ? "" : ", "
                            queryText = queryText + " " + element + endElement;
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


