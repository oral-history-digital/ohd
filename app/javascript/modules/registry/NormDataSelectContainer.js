import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getNormDataProviders, getRegistryNameTypesForCurrentProject } from 'modules/data';
import { searchRegistryEntry } from 'modules/search';
import NormDataSelect from './NormDataSelect';

const mapStateToProps = state => ({
    normDataProviders: getNormDataProviders(state),
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchRegistryEntry,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NormDataSelect);
