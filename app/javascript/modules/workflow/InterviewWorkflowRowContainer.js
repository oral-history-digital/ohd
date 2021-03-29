import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations,
    getEditView, getSelectedArchiveIds } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects, getCurrentAccount, getPeople,
    getLanguages, getCollections, getInterviews, getPeopleStatus, getCollectionsStatus,
    getLanguagesStatus, getAccountsStatus, getTasksStatus } from 'modules/data';
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
        peopleStatus: getPeopleStatus(state),
        languages: getLanguages(state),
        languagesStatus: getLanguagesStatus(state),
        collections: getCollections(state),
        collectionsStatus: getCollectionsStatus(state),
        interviews: getInterviews(state),
        interviewee: getInterviewee(state, props),
        tasks: state.data.tasks,
        tasksStatus: getTasksStatus(state),
        userAccounts: state.data.accounts,
        userAccountsStatus: getAccountsStatus(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewWorkflowRow);
