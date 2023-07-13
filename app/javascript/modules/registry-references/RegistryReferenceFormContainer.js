import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, fetchData, getRegistryEntries, getRegistryEntriesStatus,
    getRegistryReferenceTypesForCurrentProject, getRegistryReferenceTypesStatus,
    getOHDProject,
} from 'modules/data';
import RegistryReferenceForm from './RegistryReferenceForm';

const mapStateToProps = state => ({
    ohdProject: getOHDProject(state),
    registryEntries: getRegistryEntries(state),
    registryReferenceTypes: getRegistryReferenceTypesForCurrentProject(state),
    registryReferenceTypesStatus: getRegistryReferenceTypesStatus(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    lastModifiedRegistryEntries: getRegistryEntriesStatus(state).lastModified,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReferenceForm);
