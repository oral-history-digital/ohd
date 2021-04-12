import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getIsLoggedIn } from 'modules/account';
import { getLocale, getProjectId } from 'modules/archive';
import { searchInMap, getFoundMarkers, getIsMapSearching, getMapQuery, getMarkersFetched } from 'modules/search';
import { getProjects } from 'modules/data';
import MapSearch from './MapSearch';

const mapStateToProps = state => ({
    markersFetched: getMarkersFetched(state),
    foundMarkers: getFoundMarkers(state),
    query: getMapQuery(state),
    isMapSearching: getIsMapSearching(state),
    isLoggedIn: getIsLoggedIn(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInMap,
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapSearch);
