import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getRolesQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getRolesForCurrentProject, getRolesStatus, getProjectLocales } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import WrappedDataList from './WrappedDataList';
import RolePermissionsContainer from './RolePermissionsContainer';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: getProjectLocales(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        data: getRolesForCurrentProject(state),
        dataStatus: getRolesStatus(state),
        resultPagesCount: getRolesStatus(state).resultPagesCount,
        query: getRolesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'role',
        baseTabIndex: 5 + project.has_map,
        detailsAttributes: ['name', 'desc'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: 'name',
                validate: function(v){return v.length > 1}
            },
            {
                elementType: 'textarea',
                attribute: 'desc',
            },
        ],
        joinedData: {role_permission: RolePermissionsContainer},
        helpTextCode: 'role_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
