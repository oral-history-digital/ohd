import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MetadataFieldForm from './MetadataFieldForm';
import { submitData } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import { getRegistryReferenceTypesForCurrentProject, getCurrentProject } from 'modules/data';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    registryReferenceTypes: getRegistryReferenceTypesForCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MetadataFieldForm);
