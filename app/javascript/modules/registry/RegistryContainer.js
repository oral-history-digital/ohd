import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getRootRegistryEntry, getCurrentProject, getProjects } from 'modules/data';
import { setSidebarTabsIndex } from 'modules/sidebar';
import { getIsRegistryEntrySearching, getRegistryEntriesSearch, getShowRegistryEntriesSearchResults } from 'modules/search';
import { getIsLoggedIn } from 'modules/account';
import Registry from './Registry';

const mapStateToProps = (state) => ({
    rootRegistryEntry: getRootRegistryEntry(state),
    projects: getProjects(state),
    currentProject: getCurrentProject(state),
    foundRegistryEntries: getRegistryEntriesSearch(state),
    showRegistryEntriesSearchResults: getShowRegistryEntriesSearchResults(state),
    isRegistryEntrySearching: getIsRegistryEntrySearching(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSidebarTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Registry);
