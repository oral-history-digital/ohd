import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getRolesQuery } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getRoles, getRolesStatus } from 'modules/data';
import { getLocale, getLocales, getProjectId, getTranslations, getEditView } from 'modules/archive';
import WrappedDataList from './WrappedDataList';
import RolePermissionsContainer from './RolePermissionsContainer';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        data: getRoles(state),
        dataStatus: getRolesStatus(state),
        resultPagesCount: getRolesStatus(state).resultPagesCount,
        query: getRolesQuery(state),
        scope: 'role',
        baseTabIndex: 5 + project.has_map,
        detailsAttributes: ['name', 'desc'],
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
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
