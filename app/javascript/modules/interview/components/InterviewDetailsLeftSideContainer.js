import { getArchiveId, getProjectId } from 'modules/archive';
import { getCurrentInterview, getCurrentIntervieweeId } from 'modules/data';
import { connect } from 'react-redux';

import InterviewDetailsLeftSide from './InterviewDetailsLeftSide';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
    projectId: getProjectId(state),
});

export default connect(mapStateToProps)(InterviewDetailsLeftSide);
