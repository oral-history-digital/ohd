import { connect } from 'react-redux';

import { getNormDataProviders, getRegistryNameTypesForCurrentProject } from 'modules/data';
import NormDataForDescriptor from './NormDataForDescriptor';

const mapStateToProps = state => ({
    normDataProviders: getNormDataProviders(state),
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
});

export default connect(mapStateToProps)(NormDataForDescriptor);
