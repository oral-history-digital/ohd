import { connect } from 'react-redux';

import { getCurrentInterview, getCurrentInterviewee, getCurrentProject } from 'modules/data';
import { searchInArchive } from 'modules/search';
import { setViewMode } from 'modules/archive';
import InterviewTabPanel from './InterviewTabPanel';
import { hideFlyoutTabs } from '../actions';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        interview: getCurrentInterview(state),
        interviewee: getCurrentInterviewee(state),
        hasMap: project && project.has_map === 1,
        locale: state.archive.locale,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
    };
};

const mapDispatchToProps = (dispatch) => ({
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTabPanel);
