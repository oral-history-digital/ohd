import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getRegistryEntries, getRegistryEntriesStatus } from 'modules/data';
import { addRemoveRegistryEntryId, getSelectedRegistryEntryIds } from 'modules/archive';
import RegistryEntry from './RegistryEntry';

const mapStateToProps = (state) => ({
    registryEntriesStatus: getRegistryEntriesStatus(state),
    registryEntries: getRegistryEntries(state),
    selectedRegistryEntryIds: getSelectedRegistryEntryIds(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    addRemoveRegistryEntryId,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntry);
