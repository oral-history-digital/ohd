import { connect } from 'react-redux';

import { getCurrentInterview, getCurrentInterviewee } from 'modules/data';
import { getArchiveId, getProjectId } from 'modules/archive';
import InterviewDetailsLeftSide from './InterviewDetailsLeftSide';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    interviewee: getCurrentInterviewee(state),
    projectId: getProjectId(state),
});

export default connect(mapStateToProps)(InterviewDetailsLeftSide);
