import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MetadataFieldForm from './MetadataFieldForm';
import { submitData } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import { getRegistryReferenceTypes, getProjects, getCurrentProject } from 'modules/data';
import { closeArchivePopup } from 'modules/ui';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    projects: getProjects(state),
    registryReferenceTypes: getRegistryReferenceTypes(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
    closeArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MetadataFieldForm);
