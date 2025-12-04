import {
    getNormDataProviders,
    getRegistryNameTypesForCurrentProject,
} from 'modules/data';
import { connect } from 'react-redux';

import NormDataForDescriptor from './NormDataForDescriptor';

const mapStateToProps = (state) => ({
    normDataProviders: getNormDataProviders(state),
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
});

export default connect(mapStateToProps)(NormDataForDescriptor);
