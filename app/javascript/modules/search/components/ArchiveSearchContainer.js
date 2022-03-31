import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideSidebar, setSidebarTabsIndex } from 'modules/sidebar';
import { setViewMode, getViewModes, getViewMode } from 'modules/archive';
import { getIsLoggedIn } from 'modules/account';
import { searchInArchive } from '../actions';
import { getArchiveFoundInterviews, getArchiveQuery, getArchiveResultPagesCount,
    getArchiveResultsCount, getArchiveSearchResultsAvailable } from '../selectors';
import ArchiveSearch from './ArchiveSearch';

const mapStateToProps = state => ({
    resultsAvailable: getArchiveSearchResultsAvailable(state),
    foundInterviews: getArchiveFoundInterviews(state),
    resultPagesCount: getArchiveResultPagesCount(state),
    resultsCount: getArchiveResultsCount(state),
    query: getArchiveQuery(state),
    isArchiveSearching: state.search.isArchiveSearching,
    viewModes: getViewModes(state),
    currentViewMode: getViewMode(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInArchive,
    setViewMode,
    hideSidebar,
    setSidebarTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearch);
