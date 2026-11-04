import { setArchiveId } from 'modules/archive';
import {
    fetchData,
    getCollections,
    getLanguages,
    getTaskTypesForCurrentProject,
    getTasks,
    getTasksStatus,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InterviewWorkflowRow from './InterviewWorkflowRow';

const mapStateToProps = (state) => ({
    collections: getCollections(state),
    languages: getLanguages(state),
    taskTypes: getTaskTypesForCurrentProject(state),
    tasks: getTasks(state),
    tasksStatus: getTasksStatus(state),
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
