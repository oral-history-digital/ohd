import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { fetchData, getCurrentProject,
    getLanguages, getCollectionsForCurrentProject,
    getAccountsStatus, getTasksStatus, getTasks } from 'modules/data';
import InterviewWorkflowRow from './InterviewWorkflowRow';

const mapStateToProps = (state) => ({
    collections: getCollectionsForCurrentProject(state),
    languages: getLanguages(state),
    locale: getLocale(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
    tasks: getTasks(state),
    tasksStatus: getTasksStatus(state),
    translations: getTranslations(state),
    userAccountsStatus: getAccountsStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewWorkflowRow);
