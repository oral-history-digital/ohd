import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    fetchData,
    deleteData,
    submitData,
    getTaskTypesForCurrentProject,
} from 'modules/data';
import { DataList } from 'modules/admin';
import TaskPreviewContainer from './TaskPreviewContainer';

const mapStateToProps = (state) => {
    return {
        //
        // editView should always be true on tasks
        // because tasks can be seen only in the own user
        // or if editView == true in some user administration area
        //
        editView: true,
        //
        scope: 'task',
        optionsScope: 'workflow_states',
        detailsAttributes: [
            'archive_id',
            'interviewee',
            'name',
            'assigned_to_user_at',
            'assigned_to_supervisor_at',
            'started_at',
            'finished_at',
            'cleared_at',
            'restarted_at',
            'workflow_state',
        ],
        formElements: [
            {
                attribute: 'task_type_id',
                elementType: 'select',
                values: getTaskTypesForCurrentProject(state),
                withEmpty: true,
                validate: function (v) {
                    return /\d+/.test(v);
                },
            },
            {
                attribute: 'archive_id',
                validate: function (v) {
                    return /^[A-z]{2,3}\d{3,4}$/.test(v);
                },
            },
            {
                attribute: 'workflow_state',
                elementType: 'select',
                values: ['start', 'finish', 'clear', 'restart'],
                optionsScope: 'workflow_states',
            },
        ],
        showComponent: TaskPreviewContainer,
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
