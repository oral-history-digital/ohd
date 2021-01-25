import { connect } from 'react-redux';

import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { getIsLoggedIn } from 'modules/account';
import MapSearch from '../components/MapSearch';
import { searchInMap } from '../actions/searchActionCreators';
import { getLocale, getProjectId } from '../selectors/archiveSelectors';
import { getFoundMarkers, getIsMapSearching, getMapQuery, getMarkersFetched } from '../selectors/searchSelectors';
import { getProjects } from '../selectors/dataSelectors';

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
