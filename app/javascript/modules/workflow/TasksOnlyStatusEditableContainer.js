import { DataList } from 'modules/admin';
import { deleteData, fetchData, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CommentsContainer from './CommentsContainer';
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
                attribute: 'workflow_state',
                elementType: 'select',
                optionsScope: 'workflow_states',
                withEmpty: true,
            },
        ],
        showComponent: TaskPreviewContainer,
        joinedData: {
            comment: CommentsContainer,
        },
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
