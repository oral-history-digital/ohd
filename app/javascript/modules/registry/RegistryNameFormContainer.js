import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getNormDataProviders,
    getRegistryNameTypesForCurrentProject,
} from 'modules/data';
import RegistryNameForm from './RegistryNameForm';
import { getRegistryEntriesSearch, searchRegistryEntry } from 'modules/search';

const mapStateToProps = (state) => ({
    registryNameTypes: getRegistryNameTypesForCurrentProject(state),
    normDataProviders: getNormDataProviders(state),
    foundRegistryEntries: getRegistryEntriesSearch(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            searchRegistryEntry,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RegistryNameForm);
