import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteData, fetchData, getRegistryEntries, getRegistryEntriesStatus,
    getCurrentProject } from 'modules/data';
import RegistryReference from './RegistryReference';

const mapStateToProps = state => ({
    // locale is set via props.
    project: getCurrentProject(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteData,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryReference);
