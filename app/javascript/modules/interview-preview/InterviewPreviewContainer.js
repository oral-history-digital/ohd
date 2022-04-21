import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, addRemoveArchiveId, getLocale, getSelectedArchiveIds } from 'modules/archive';
import { getInterviewee, getCurrentProject, getProjects, getInterviewsStatus } from 'modules/data';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state, props) => ({
    locale: getLocale(state),
    project: getCurrentProject(state),
    projects: getProjects(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    statuses: getInterviewsStatus(state),
    interviewee: getInterviewee(state, props),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    addRemoveArchiveId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
