import { connect } from 'react-redux';

import { getEditView } from 'modules/archive';
import {
    getCurrentProject,
    getProjects,
    getRootRegistryEntry
} from 'modules/data';
import {
    getIsRegistryEntrySearching,
    getRegistryEntriesSearch,
    getShowRegistryEntriesSearchResults
} from 'modules/search';
import { getIsLoggedIn } from 'modules/account';
import Registry from './Registry';

const mapStateToProps = (state) => ({
    rootRegistryEntry: getRootRegistryEntry(state),
    editView: getEditView(state),
    projects: getProjects(state),
    currentProject: getCurrentProject(state),
    foundRegistryEntries: getRegistryEntriesSearch(state),
    showRegistryEntriesSearchResults: getShowRegistryEntriesSearchResults(state),
    isRegistryEntrySearching: getIsRegistryEntrySearching(state),
    isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps)(Registry);
