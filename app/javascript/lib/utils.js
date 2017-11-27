var ArchiveUtils = {
    getInterview: function(state) {
        return state.archive.interviews[state.archive.archiveId];
    },

    getLocationsForInterview: function(state) {
        return state.locations[state.archive.archiveId];
    },

  translate: function(props, key) {
      return props.translations && props.translations[props.locale] && props.translations[props.locale][key];
  }
};

export default ArchiveUtils;


