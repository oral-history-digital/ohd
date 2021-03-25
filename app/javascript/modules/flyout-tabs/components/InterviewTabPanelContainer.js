import { connect } from 'react-redux';

import { getCurrentInterview, getCurrentInterviewee, getCurrentProject, getProjects, getCurrentAccount } from 'modules/data';
import { searchInArchive } from 'modules/search';
import { setViewMode, getLocale, getArchiveId, getProjectId, getTranslations, getEditView } from 'modules/archive';
import InterviewTabPanel from './InterviewTabPanel';
import { hideFlyoutTabs } from '../actions';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        interview: getCurrentInterview(state),
        interviewee: getCurrentInterviewee(state),
        hasMap: project && project.has_map === 1,
        locale: getLocale(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
    };
};

const mapDispatchToProps = (dispatch) => ({
    searchInArchive: (url, query) => dispatch(searchInArchive(url, query)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    setViewMode: (viewMode) => dispatch(setViewMode(viewMode)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTabPanel);
