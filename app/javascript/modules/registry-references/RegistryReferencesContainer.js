import {
    getCurrentInterview,
    getRegistryEntries,
    getRegistryEntriesStatus,
} from 'modules/data';
import { connect } from 'react-redux';

import RegistryReferences from './RegistryReferences';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    registryEntries: getRegistryEntries(state),
    registryEntriesStatus: getRegistryEntriesStatus(state),
});

export default connect(mapStateToProps)(RegistryReferences);
