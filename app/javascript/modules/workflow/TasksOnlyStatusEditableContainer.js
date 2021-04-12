import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DataList } from 'modules/admin';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getProjects, getCurrentAccount } from 'modules/data';
import { getLocale, getProjectId, getTranslations } from 'modules/archive';
import CommentsContainer from './CommentsContainer';

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
                attribute: 'workflow_state',
                elementType: 'select',
                optionsScope: 'workflow_states',
                withEmpty: true,
            },
        ],
        joinedData: {
            comment: CommentsContainer,
        },
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
