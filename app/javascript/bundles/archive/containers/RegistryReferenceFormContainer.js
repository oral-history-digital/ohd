import { connect } from 'react-redux';

import RegistryReferenceForm from '../components/RegistryReferenceForm';
import { submitData, fetchData } from '../actions/dataActionCreators';
import { closeArchivePopup } from 'modules/ui';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locales: (project && project.available_locales) || state.archive.locales,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        registryEntries: state.data.registry_entries,
        registryReferenceTypes: state.data.registry_reference_types,
        registryReferenceTypesStatus: state.data.statuses.registry_reference_types.all,
        registryEntriesStatus: state.data.statuses.registry_entries,
        lastModifiedRegistryEntries: state.data.statuses.registry_entries.lastModified,
    }
}

const mapDispatchToProps = (dispatch) => ({
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    submitData: (props, params) => dispatch(submitData(props, params)),
    closeArchivePopup: () => dispatch(closeArchivePopup())
})

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferenceForm);
