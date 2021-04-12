import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getPermissions, getPermissionsStatus } from 'modules/data';
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
        account: getCurrentAccount(state),
        editView: getEditView(state),
        //
        //
        //
        joinDataStatus: getPermissionsStatus(state),
        joinDataScope: 'permissions',
        scope: 'task_type_permission',
        detailsAttributes: ['name', 'desc', 'klass', 'action_name'],
        formElements: [
            {
                elementType: 'select',
                attribute: 'permission_id',
                values: getPermissions(state),
                withEmpty: true,
                validate: function(v){return v.length > 0}
            }
        ],
        hideEdit: true
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
