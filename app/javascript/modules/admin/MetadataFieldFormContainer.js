import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MetadataFieldForm from './MetadataFieldForm';
import { submitData } from 'modules/data';
import { getRegistryReferenceTypesForCurrentProject } from 'modules/data';

const mapStateToProps = state => ({
    registryReferenceTypes: getRegistryReferenceTypesForCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MetadataFieldForm);
