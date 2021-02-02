import { connect } from 'react-redux';

import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getIsLoggedIn } from 'modules/account';
import { getLocale, getProjectId } from 'modules/archive';
import { searchInMap, getFoundMarkers, getIsMapSearching, getMapQuery, getMarkersFetched } from 'modules/search';
import { getProjects } from 'bundles/archive/selectors/dataSelectors';
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

const mapDispatchToProps = (dispatch) => ({
    searchInMap: (url, query) => dispatch(searchInMap(url, query)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MapSearch);
