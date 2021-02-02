import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RegistryEntriesTree from '../components/RegistryEntriesTree';
import { getRootRegistryEntry, getCurrentProject } from 'modules/data';
import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getProjectId } from 'modules/archive';
import { getIsRegistryEntrySearching, getRegistryEntriesSearch, getShowRegistryEntriesTree } from 'modules/search';

const mapStateToProps = (state) => ({
    rootRegistryEntry: getRootRegistryEntry(state),
    projectId: getProjectId(state),
    projects: state.data.projects,
    currentProject: getCurrentProject(state),
    foundRegistryEntries: getRegistryEntriesSearch(state),
    showRegistryEntriesTree: getShowRegistryEntriesTree(state),
    isRegistryEntrySearching: getIsRegistryEntrySearching(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegistryEntriesTree);
