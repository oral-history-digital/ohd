import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, fetchData, getProjects, getRegistryEntries, getRegistryEntriesStatus,
    getRegistryReferenceTypes, getRegistryReferenceTypesStatus } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';
import { getLocale, getProjectId } from 'modules/archive';
import RegistryReferenceForm from './RegistryReferenceForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    registryEntries: getRegistryEntries(state),
    registryReferenceTypes: getRegistryReferenceTypes(state),
    registryReferenceTypesStatus: getRegistryReferenceTypesStatus(state).all,
    registryEntriesStatus: getRegistryEntriesStatus(state),
    lastModifiedRegistryEntries: getRegistryEntriesStatus(state).lastModified,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferenceForm);
