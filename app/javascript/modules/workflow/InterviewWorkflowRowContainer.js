import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations,
    getEditView, getSelectedArchiveIds } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects, getCurrentAccount, getPeople,
    getLanguages, getCollections, getInterviews, getPeopleStatus, getCollectionsStatus,
    getLanguagesStatus, getAccounts, getAccountsStatus, getTasksStatus, getTasks } from 'modules/data';
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
        tasks: getTasks(state),
        tasksStatus: getTasksStatus(state),
        userAccounts: getAccounts(state),
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
