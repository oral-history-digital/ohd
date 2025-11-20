import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getCurrentInterview,
    getCurrentIntervieweeId,
    getCurrentProject,
    getIsCatalog,
} from 'modules/data';
import { setViewMode, getArchiveId, getProjectId } from 'modules/archive';
import { getIsLoggedIn } from 'modules/user';
import InterviewTabPanel from './InterviewTabPanel';
import { hideSidebar } from '../actions';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
    hasMap: getCurrentProject(state)?.has_map,
    isCatalog: getIsCatalog(state),
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
