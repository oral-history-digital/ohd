import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getRegistryEntries, getRegistryEntriesStatus } from 'modules/data';
import RegistryEntryShow from './RegistryEntryShow';

const mapStateToProps = (state) => ({
    registryEntriesStatus: getRegistryEntriesStatus(state),
    registryEntries: getRegistryEntries(state),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntryShow);
