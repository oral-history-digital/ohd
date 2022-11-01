import { connect } from 'react-redux';

import { getNormDataProviders, getRegistryNameTypesForCurrentProject } from 'modules/data';
import { getLocale } from 'modules/archive';
import NormDataForDescriptor from './NormDataForDescriptor';

const mapStateToProps = state => ({
    locale: getLocale(state),
    normDataProviders: getNormDataProviders(state),
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
});

export default connect(mapStateToProps)(NormDataForDescriptor);
