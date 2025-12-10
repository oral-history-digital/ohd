import {
    fetchData,
    getOHDProject,
    getRegistryEntries,
    getRegistryEntriesStatus,
    getRegistryReferenceTypesForCurrentProject,
    getRegistryReferenceTypesStatus,
    submitData,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RegistryReferenceForm from './RegistryReferenceForm';

const mapStateToProps = (state) => ({
    ohdProject: getOHDProject(state),
    registryEntries: getRegistryEntries(state),
    registryReferenceTypes: getRegistryReferenceTypesForCurrentProject(state),
    registryReferenceTypesStatus: getRegistryReferenceTypesStatus(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
    lastModifiedRegistryEntries: getRegistryEntriesStatus(state).lastModified,
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            submitData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegistryReferenceForm);
