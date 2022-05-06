import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getProjects, getNormDataProviders, getRegistryNameTypesForCurrentProject } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import RegistryEntryFromNormDataForm from './RegistryEntryFromNormDataForm';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    normDataProviders: getNormDataProviders(state),
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryFromNormDataForm);
