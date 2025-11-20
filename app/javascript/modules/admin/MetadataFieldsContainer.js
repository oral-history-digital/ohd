import {
    deleteData,
    fetchData,
    getCurrentProject,
    getRegistryReferenceTypesStatus,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MetadataFieldFormContainer from './MetadataFieldFormContainer';
import MetadataFieldShow from './MetadataFieldShow';
import WrappedDataList from './WrappedDataList';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        data: project.metadata_fields,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'metadata_field',
        joinDataStatus: getRegistryReferenceTypesStatus(state),
        joinDataScope: 'registry_reference_types',
        detailsAttributes: [
            'name',
            'use_as_facet',
            'use_in_results_table',
            'use_in_details_view',
            'use_in_map_search',
            'display_on_landing_page',
            'ref_object_type',
            'source',
            'label',
        ],
        form: MetadataFieldFormContainer,
        showComponent: MetadataFieldShow,
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
