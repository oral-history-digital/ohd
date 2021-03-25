import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations,
    getEditView, getSelectedArchiveIds } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects, getCurrentAccount, getPeople,
    getLanguages, getCollections, getInterviews } from 'modules/data';
import InterviewWorkflowRow from './InterviewWorkflowRow';

const mapStateToProps = (state, props) => {
    let project = getCurrentProject(state);
    return {
        fulltext: state.search.archive.query.fulltext,
        interviewSearchResults: state.search.interviews,
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        project: project,
        editView: getEditView(state),
        account: getCurrentAccount(state),
        selectedArchiveIds: getSelectedArchiveIds(state),
        people: getPeople(state),
        peopleStatus: state.data.statuses.people,
        languages: getLanguages(state),
        languagesStatus: state.data.statuses.languages,
        collections: getCollections(state),
        collectionsStatus: state.data.statuses.collections,
        interviews: getInterviews(state),
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
