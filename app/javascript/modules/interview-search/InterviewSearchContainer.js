import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getProjects, getCurrentRefTreeStatus } from 'modules/data';
import { getArchiveId, getLocale, getProjectId } from 'modules/archive';
import { getCurrentInterviewSearchResults } from 'modules/search';
import InterviewSearch from './InterviewSearch';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    archiveId: getArchiveId(state),
    isInterviewSearching: state.search.isInterviewSearching,
    currentInterviewSearchResults: getCurrentInterviewSearchResults(state),
    refTreeStatus: getCurrentRefTreeStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearch);
