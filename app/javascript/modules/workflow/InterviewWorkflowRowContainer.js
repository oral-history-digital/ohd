import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations,
    getEditView, getSelectedArchiveIds } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject } from 'modules/data';
import InterviewWorkflowRow from './InterviewWorkflowRow';

const mapStateToProps = (state, props) => {
    let project = getCurrentProject(state);
    return {
        fulltext: state.search.archive.query.fulltext,
        interviewSearchResults: state.search.interviews,
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        translations: getTranslations(state),
        project: project,
        editView: getEditView(state),
        account: state.data.accounts.current,
        selectedArchiveIds: getSelectedArchiveIds(state),
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        languages: state.data.languages,
        languagesStatus: state.data.statuses.languages,
        collections: state.data.collections,
        collectionsStatus: state.data.statuses.collections,
        interviews: state.data.interviews,
        interviewee: getInterviewee(state, props),
        tasks: state.data.tasks,
        tasksStatus: state.data.statuses.tasks,
        userAccounts: state.data.accounts,
        userAccountsStatus: state.data.statuses.accounts
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewWorkflowRow);
