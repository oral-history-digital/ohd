import { connect } from 'react-redux';

import { closeArchivePopup } from 'modules/ui';
import { fetchData, deleteData, submitData } from 'modules/data';
import DataList from './DataList';
import MetadataFieldFormContainer from './MetadataFieldFormContainer';
import MetadataFieldShow from './MetadataFieldShow';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        translations: state.archive.translations,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        account: state.data.accounts.current,
        editView: true,
        //
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

export default connect(mapStateToProps, mapDispatchToProps)(DataList);
