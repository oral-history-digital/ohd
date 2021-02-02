import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getRootRegistryEntry, getCurrentProject, getProjects } from 'modules/data';
import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getIsRegistryEntrySearching, getRegistryEntriesSearch, getShowRegistryEntriesTree } from 'modules/search';
import Registry from './Registry';

const mapStateToProps = (state) => ({
    rootRegistryEntry: getRootRegistryEntry(state),
    projects: getProjects(state),
    currentProject: getCurrentProject(state),
    foundRegistryEntries: getRegistryEntriesSearch(state),
    showRegistryEntriesTree: getShowRegistryEntriesTree(state),
    isRegistryEntrySearching: getIsRegistryEntrySearching(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Registry);
