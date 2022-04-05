import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { hideSidebar } from 'modules/sidebar';
import { setViewMode, getViewModes, getViewMode } from 'modules/archive';
import { getArchiveFoundInterviews, getArchiveQuery, getArchiveResultPagesCount }
    from '../selectors';
import ArchiveSearchTabs from './ArchiveSearchTabs';

const mapStateToProps = state => ({
    foundInterviews: getArchiveFoundInterviews(state),
    resultPagesCount: getArchiveResultPagesCount(state),
    query: getArchiveQuery(state),
    isArchiveSearching: state.search.isArchiveSearching,
    viewModes: getViewModes(state),
    currentViewMode: getViewMode(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setViewMode,
    hideSidebar,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ArchiveSearchTabs);
