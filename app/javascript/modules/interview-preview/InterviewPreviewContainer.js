import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview, getInterviewSearchResults } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getSelectedArchiveIds } from 'modules/archive';
import { getInterviewee, getCurrentProject, getProjects, getInterviewsStatus } from 'modules/data';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state, props) => ({
    locale: getLocale(state),
    project: getCurrentProject(state),
    projects: getProjects(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    statuses: getInterviewsStatus(state),
    interviewSearchResults: getInterviewSearchResults(state),
    interviewee: getInterviewee(state, props),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
