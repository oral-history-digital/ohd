import { connect } from 'react-redux';

import { getCurrentInterview, getRegistryEntries, getRegistryEntriesStatus } from 'modules/data';
import RegistryReferences from './RegistryReferences';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
});

export default connect(mapStateToProps)(RegistryReferences);
