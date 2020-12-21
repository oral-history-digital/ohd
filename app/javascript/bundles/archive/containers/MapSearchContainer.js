import { connect } from 'react-redux';
import MapSearch from '../components/MapSearch';
import { searchInMap } from '../actions/searchActionCreators';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';
import { getLocale, getProjectId } from '../selectors/archiveSelectors';
import { getIsLoggedIn } from '../selectors/accountSelectors';
import { getFoundMarkers, getIsMapSearching, getMapQuery, getMarkersFetched } from '../selectors/searchSelectors';

const mapStateToProps = state => ({
    markersFetched: getMarkersFetched(state),
    foundMarkers: getFoundMarkers(state),
    query: getMapQuery(state),
    isMapSearching: getIsMapSearching(state),
    isLoggedIn: getIsLoggedIn(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
});

const mapDispatchToProps = (dispatch) => ({
    searchInMap: (url, query) => dispatch(searchInMap(url, query)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MapSearch);
