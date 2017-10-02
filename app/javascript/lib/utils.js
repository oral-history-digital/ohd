var ArchiveUtils = {
  getInterview: function(state) {
    return state.archive.interviews[state.archive.archiveId];
  }
};

export default ArchiveUtils;


