import { connect } from 'react-redux';

import { getInterviewee, getProject } from 'lib/utils';
import { getCurrentInterview } from 'bundles/archive/selectors/dataSelectors';
import { searchInArchive } from 'modules/search';
import { setViewMode } from 'bundles/archive/actions/archiveActionCreators';
import InterviewTabPanel from './InterviewTabPanel';
import { hideFlyoutTabs } from '../actions';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        interview: getCurrentInterview(state),
        interviewee: getInterviewee({interview: getCurrentInterview(state), people: state.data.people}),
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
