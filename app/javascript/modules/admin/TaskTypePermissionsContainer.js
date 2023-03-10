import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, deleteData, submitData, getProjectLocales, getProjects, getCurrentAccount,
    getCurrentProject, getPermissions, getPermissionsStatus } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import DataList from './DataList';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    locales: getProjectLocales(state),
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
    hideEdit: true,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
