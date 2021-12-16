import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, fetchData, getProjects, getRegistryEntries, getRegistryEntriesStatus,
    getRegistryReferenceTypesForCurrentProject, getRegistryReferenceTypesStatus,
    getCurrentProject
} from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import RegistryReferenceForm from './RegistryReferenceForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    project: getCurrentProject(state),
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
