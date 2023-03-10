import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentProject, fetchData, deleteData, submitData, getProjects, getCurrentAccount, getTaskTypesForCurrentProject } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import { DataList } from 'modules/admin';
import TaskPreviewContainer from './TaskPreviewContainer';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        project: getCurrentProject(state),
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
                values: getTaskTypesForCurrentProject(state),
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

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
