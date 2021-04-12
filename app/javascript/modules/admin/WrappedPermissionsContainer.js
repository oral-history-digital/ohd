import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getPermissions, getPermissionsStatus } from 'modules/data';
import { getLocale, getLocales, getProjectId, getTranslations, getEditView } from 'modules/archive';
import WrappedDataList from './WrappedDataList';

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
        data: getPermissions(state),
        dataStatus: getPermissionsStatus(state),
        resultPagesCount: getPermissionsStatus(state).resultPagesCount,
        query: state.search.permissions.query,
        scope: 'permission',
        baseTabIndex: 5 + project.has_map,
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
        ]
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
