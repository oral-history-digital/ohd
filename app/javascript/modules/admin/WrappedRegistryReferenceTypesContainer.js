import { connect } from 'react-redux';

import WrappedDataList from './WrappedDataList';
import { setQueryParams } from 'modules/search';
import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData, getCurrentProject } from 'modules/data';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        data: state.data.registry_reference_types,
        dataStatus: state.data.statuses.registry_reference_types,
        resultPagesCount: state.data.statuses.registry_reference_types.resultPagesCount,
        query: state.search.registry_reference_types.query,
        scope: 'registry_reference_type',
        sortAttribute: 'name',
        sortAttributeTranslated: true,
        baseTabIndex: 4 + project.has_map,
        detailsAttributes: ['code'],
        initialFormValues: {project_id: project.id},
        formElements: [
            {
                elementType: 'registryEntrySelect',
                attribute: 'registry_entry_id',
                lowestAllowedRegistryEntryId: project?.root_registry_entry_id,
                goDeeper: true,
                help: 'help_texts.registry_reference_types.registry_entry_id',
            },
            {
                attribute: 'use_in_transcript',
                elementType: 'input',
                type: 'checkbox',
            },
            {
                attribute: 'code',
                help: 'help_texts.registry_reference_types.code',
            },
            {
                attribute: 'name',
                multiLocale: true,
            },
        ],
        joinedData: { },
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    setQueryParams: (scope, params) => dispatch(setQueryParams(scope, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);