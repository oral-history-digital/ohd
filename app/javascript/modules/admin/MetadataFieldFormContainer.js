import { connect } from 'react-redux';

import MetadataFieldForm from './MetadataFieldForm';
import { submitData } from 'modules/data';
import { getLocale, getProjectId, getArchiveId } from 'modules/archive';
import { getRegistryReferenceTypes, getProjects } from 'modules/data';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    registryReferenceTypes: getRegistryReferenceTypes(state),
});

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MetadataFieldForm);
