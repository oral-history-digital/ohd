import { connect } from 'react-redux';

import { getCurrentInterview, getCurrentInterviewee, getCurrentProject } from 'modules/data';
import { searchInArchive } from 'modules/search';
import { setViewMode, getLocale, getArchiveId, getProjectId, getTranslations, getEditView } from 'modules/archive';
import InterviewTabPanel from './InterviewTabPanel';
import { hideFlyoutTabs } from '../actions';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        interview: getCurrentInterview(state),
        interviewee: getCurrentInterviewee(state),
        hasMap: project && project.has_map === 1,
        locale: getLocale(state),
        translations: getTranslations(state),
        account: state.data.accounts.current,
        editView: getEditView(state),
    };
};

const mapDispatchToProps = (dispatch) => ({
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTabPanel);
