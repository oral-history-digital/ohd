import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview, getCurrentInterviewee, getCurrentProject, getIsCatalog } from 'modules/data';
import { searchInArchive } from 'modules/search';
import { setViewMode, getArchiveId, getProjectId } from 'modules/archive';
import InterviewTabPanel from './InterviewTabPanel';
import { hideFlyoutTabs } from '../actions';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        interview: getCurrentInterview(state),
        interviewee: getCurrentInterviewee(state),
        hasMap: project && project.has_map === 1,
        isCatalog: getIsCatalog(state),
    };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInArchive,
    hideFlyoutTabs,
    setViewMode,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTabPanel);
