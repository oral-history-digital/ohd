import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations, getProjectId } from 'modules/archive';
import { getCurrentProject, fetchData, deleteData, submitData, getProjects, getCurrentUser, getRegistryReferenceTypesStatus } from 'modules/data';
import WrappedDataList from './WrappedDataList';
import MetadataFieldFormContainer from './MetadataFieldFormContainer';
import MetadataFieldShow from './MetadataFieldShow';

const mapStateToProps = state => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        translations: getTranslations(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        user: getCurrentUser(state),
        editView: true,
        //
        data: project.metadata_fields,
        outerScope: 'project',
        outerScopeId: project.id,
        scope: 'metadata_field',
        joinDataStatus: getRegistryReferenceTypesStatus(state),
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

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedDataList);
