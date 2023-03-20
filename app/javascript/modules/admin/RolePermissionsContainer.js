import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId, getEditView } from 'modules/archive';
import { fetchData, deleteData, submitData, getProjectLocales, getProjects, getCurrentUser,
    getCurrentProject, getPermissions, getPermissionsStatus } from 'modules/data';
import DataList from './DataList';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    translations: getTranslations(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    user: getCurrentUser(state),
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
    hideEdit: true,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
