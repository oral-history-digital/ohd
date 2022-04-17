import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects,
    getLanguages, getCollectionsForCurrentProject, getPeopleStatus,
    getAccountsStatus, getTasksStatus, getTasks } from 'modules/data';
import InterviewWorkflowRow from './InterviewWorkflowRow';

const mapStateToProps = (state, props) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    project: getCurrentProject(state),
    peopleStatus: getPeopleStatus(state),
    languages: getLanguages(state),
    collections: getCollectionsForCurrentProject(state),
    interviewee: getInterviewee(state, props),
    tasks: getTasks(state),
    tasksStatus: getTasksStatus(state),
    userAccountsStatus: getAccountsStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    searchInInterview,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewWorkflowRow);
