import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getLocales, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getPermissions, getPermissionsStatus } from 'modules/data';
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
        joinDataStatus: getPermissionsStatus(state),
        joinDataScope: 'permissions',
        scope: 'role_permission',
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
