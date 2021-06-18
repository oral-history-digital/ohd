import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getTaskTypesQuery } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getTaskTypesForCurrentProject, getTaskTypesStatus } from 'modules/data';
import { getLocale, getProjectId, getLocales, getTranslations, getEditView } from 'modules/archive';
import TaskTypePermissionsContainer from './TaskTypePermissionsContainer';
import WrappedDataList from './WrappedDataList';

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
        data: getTaskTypesForCurrentProject(state),
        dataStatus: getTaskTypesStatus(state),
        resultPagesCount: getTaskTypesStatus(state).resultPagesCount,
        query: getTaskTypesQuery(state),
        scope: 'task_type',
        baseTabIndex: 5 + project.has_map,
        detailsAttributes: ['name', 'desc'],
        formElements: [
            {
                attribute: 'label',
                multiLocale: true,
            },
            {
                attribute: 'key',
            },
            {
                attribute: 'abbreviation',
                validate: function(v){return v.length > 1}
            },
            {
                elementType: 'input',
                attribute: 'use',
                type: 'checkbox',
            },
            {
                elementType: 'select',
                attribute: 'project_id',
                values: getProjects(state),
                withEmpty: true,
            },
        ],
        joinedData: {task_type_permission: TaskTypePermissionsContainer},
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
