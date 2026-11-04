import { getArchiveId, getProjectId, setViewMode } from 'modules/archive';
import { getCurrentInterview, getCurrentIntervieweeId } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideSidebar } from '../actions';
import InterviewTabPanel from './InterviewTabPanel';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            hideSidebar,
            setViewMode,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTabPanel);
