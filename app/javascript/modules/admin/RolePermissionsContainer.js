import { connect } from 'react-redux';

import { getLocale, getLocales, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount } from 'modules/data';
import DataList from './DataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        translations: getTranslations(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        //
        //
        //
        joinDataStatus: state.data.statuses.permissions,
        joinDataScope: 'permissions',
        scope: 'role_permission',
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
