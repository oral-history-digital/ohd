import { connect } from 'react-redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { closeArchivePopup } from 'modules/ui';
import { getCurrentProject, fetchData, deleteData, submitData } from 'modules/data';
import WrappedDataList from './WrappedDataList';
import MetadataFieldFormContainer from './MetadataFieldFormContainer';
import MetadataFieldShow from './MetadataFieldShow';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        translations: getTranslations(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        account: state.data.accounts.current,
        editView: true,
        //
        data: project.metadata_fields,
        scope: 'metadata_field',
        joinDataStatus: state.data.statuses.registry_reference_types,
        joinDataScope: 'registry_reference_types',
        detailsAttributes: [
            "name",
            "use_as_facet",
            "use_in_results_table",
            "use_in_details_view",
            "use_in_map_search",
            "display_on_landing_page",
            "ref_object_type",
            "source",
            "label",
        ],
        form: MetadataFieldFormContainer,
        showComponent: MetadataFieldShow,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
