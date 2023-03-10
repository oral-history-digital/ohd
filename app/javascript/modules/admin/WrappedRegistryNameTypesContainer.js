import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { setQueryParams, getRegistryNameTypesQuery } from 'modules/search';
import { fetchData, deleteData, submitData, getCurrentProject, getCurrentAccount,
    getRegistryNameTypesForCurrentProject, getProjectLocales, getRegistryNameTypesStatus } from 'modules/data';
import WrappedDataList from './WrappedDataList';

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
        data: getRegistryNameTypesForCurrentProject(state),
        dataStatus: getRegistryNameTypesStatus(state),
        resultPagesCount: getRegistryNameTypesStatus(state).resultPagesCount,
        query: getRegistryNameTypesQuery(state),
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'registry_name_type',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        baseTabIndex: 4 + project.has_map,
        detailsAttributes: ['name'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                attribute: 'code',
                help: 'help_texts.registry_name_types.code',
                validate: function(v){return /^\w+$/.test(v)}
            },
            {
                attribute: 'name',
            },
        ],
        joinedData: { },
        helpTextCode: 'registry_name_type_form'
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
    setQueryParams,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
