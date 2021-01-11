import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RegistryEntriesTree from '../components/RegistryEntriesTree';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';
import { getRootRegistryEntry } from '../selectors/dataSelectors';
import { getProjectId } from '../selectors/archiveSelectors';
import { getIsRegistryEntrySearching, getRegistryEntriesSearch, getShowRegistryEntriesTree } from '../selectors/searchSelectors';

const mapStateToProps = (state) => ({
    rootRegistryEntry: getRootRegistryEntry(state),
    projectId: getProjectId(state),
    foundRegistryEntries: getRegistryEntriesSearch(state),
    showRegistryEntriesTree: getShowRegistryEntriesTree(state),
    isRegistryEntrySearching: getIsRegistryEntrySearching(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTree);
