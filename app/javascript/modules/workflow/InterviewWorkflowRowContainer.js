import { getLocale, getProjectId, setArchiveId } from 'modules/archive';
import {
    fetchData,
    getCollectionsForCurrentProject,
    getCurrentProject,
    getLanguages,
    getTasks,
    getTasksStatus,
    getUsersStatus,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InterviewWorkflowRow from './InterviewWorkflowRow';

const mapStateToProps = (state) => ({
    collections: getCollectionsForCurrentProject(state),
    languages: getLanguages(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
    tasks: getTasks(state),
    tasksStatus: getTasksStatus(state),
    usersStatus: getUsersStatus(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setArchiveId,
            fetchData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InterviewWorkflowRow);
