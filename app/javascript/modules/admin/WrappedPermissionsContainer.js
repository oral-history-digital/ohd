import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getPermissionsQuery } from 'modules/search';
import { getCurrentProject, fetchData, deleteData, submitData, getProjects, getCurrentUser,
    getPermissions, getPermissionsStatus, getProjectLocales, getProjectHasMap } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = state => ({
    locale: getLocale(state),
    locales: getProjectLocales(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
    translations: getTranslations(state),
    user: getCurrentUser(state),
    editView: getEditView(state),
    data: getPermissions(state),
    dataStatus: getPermissionsStatus(state),
    resultPagesCount: getPermissionsStatus(state).resultPagesCount,
    query: getPermissionsQuery(state),
    scope: 'permission',
    baseTabIndex: 5 + getProjectHasMap(state),
    detailsAttributes: ['name', 'desc', 'klass', 'action_name'],
    formElements: [
        {
            attribute: 'name',
            validate: function(v){return v.length > 1}
        },
        {
            elementType: 'textarea',
            attribute: 'desc',
        },
        {
            attribute: 'klass',
            validate: function(v){return v.length > 1}
        },
        {
            attribute: 'action_name',
            validate: function(v){return v.length > 1}
        },
    ],
    helpTextCode: 'permission_form'
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
