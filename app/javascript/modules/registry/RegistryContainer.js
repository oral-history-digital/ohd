import { connect } from 'react-redux';

import {
    getIsRegistryEntrySearching,
    getRegistryEntriesSearch,
    getShowRegistryEntriesSearchResults,
} from 'modules/search';
import Registry from './Registry';

const mapStateToProps = (state) => ({
    foundRegistryEntries: getRegistryEntriesSearch(state) || {}, // default to empty object
    showRegistryEntriesSearchResults:
        getShowRegistryEntriesSearchResults(state),
    isRegistryEntrySearching: getIsRegistryEntrySearching(state),
});

export default connect(mapStateToProps)(Registry);
