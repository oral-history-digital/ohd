import { connect } from 'react-redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getProjects, getCurrentAccount, getTaskTypes } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { DataList } from 'modules/admin';
import TaskPreviewContainer from './TaskPreviewContainer';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        //
        // editView should always be true on tasks
        // because tasks can be seen only in the own account
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
            'assigned_to_user_account_at',
            'assigned_to_supervisor_at',
            'started_at',
            'finished_at',
            'cleared_at',
            'restarted_at',
            'workflow_state'
        ],
        formElements: [
            {
                attribute: 'task_type_id',
                elementType: 'select',
                values: getTaskTypes(state),
                withEmpty: true,
                validate: function(v){return /\d+/.test(v)}
            },
            {
                attribute: 'archive_id',
                validate: function(v){return /^[A-z]{2,3}\d{3,4}$/.test(v)},
            },
            //{
                //attribute: 'interview_id',
                //elementType: 'select',
                //values: getInterviews(state),
                //withEmpty: true,
                //validate: function(v){return /^\d+$/.test(v)}
            //},
            {
                attribute: 'workflow_state',
                elementType: 'select',
                values: ['start', 'finish', 'clear', 'restart'],
                optionsScope: 'workflow_states',
            },
        ],
        showComponent: TaskPreviewContainer,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(DataList);