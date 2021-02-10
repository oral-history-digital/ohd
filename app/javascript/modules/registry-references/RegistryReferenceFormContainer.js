import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, fetchData, getProjects } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getProjectId } from 'modules/archive';
import RegistryReferenceForm from './RegistryReferenceForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    registryEntries: state.data.registry_entries,
    registryReferenceTypes: state.data.registry_reference_types,
    registryReferenceTypesStatus: state.data.statuses.registry_reference_types.all,
    registryEntriesStatus: state.data.statuses.registry_entries,
    lastModifiedRegistryEntries: state.data.statuses.registry_entries.lastModified,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferenceForm);
