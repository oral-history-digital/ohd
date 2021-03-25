import { connect } from 'react-redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects } from 'modules/data';
import { getLocale, getProjectId, getLocales, getTranslations, getEditView } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        locales: (project && project.available_locales) || getLocales(state),
        translations: getTranslations(state),
        account: state.data.accounts.current,
        editView: getEditView(state),
        //
        //
        //
        joinDataStatus: state.data.statuses.permissions,
        joinDataScope: 'permissions',
        scope: 'task_type_permission',
        detailsAttributes: ['name', 'desc', 'klass', 'action_name'],
        formElements: [
            {
                elementType: 'select',
                attribute: 'permission_id',
                values: state.data.permissions,
                withEmpty: true,
                validate: function(v){return v.length > 0}
            }
        ],
        hideEdit: true
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
