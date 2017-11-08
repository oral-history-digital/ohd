var ArchiveUtils = {
  getInterview: function(state) {
    return state.archive.interviews[state.archive.archiveId];
  },

  getLocationsForInterview: function(state) {
    return state.locations[state.archive.archiveId];
  }
};

export default ArchiveUtils;


