import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setQueryParams, getTaskTypesQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getCurrentProject, getProjects, getCurrentAccount,
    getTaskTypesForCurrentProject, getTaskTypesStatus, getProjectLocales } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import TaskTypePermissionsContainer from './TaskTypePermissionsContainer';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        locales: getProjectLocales(state),
        translations: getTranslations(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        data: getTaskTypesForCurrentProject(state),
        dataStatus: getTaskTypesStatus(state),
        resultPagesCount: getTaskTypesStatus(state).resultPagesCount,
        query: getTaskTypesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'task_type',
        baseTabIndex: 5 + project.has_map,
        detailsAttributes: ['name', 'desc'],
        initialFormValues: {project_id: project.id},
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
        ],
        joinedData: {task_type_permission: TaskTypePermissionsContainer},
        helpTextCode: 'task_type_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
