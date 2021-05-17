import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { searchInMap, getMapMarkers, getIsMapSearching, getMapQuery, getMarkersFetched } from 'modules/search';
import MapSearch from './MapSearch';

const mapStateToProps = state => ({
    markersFetched: getMarkersFetched(state),
    mapMarkers: getMapMarkers(state),
    query: getMapQuery(state),
    isMapSearching: getIsMapSearching(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInMap,
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapSearch);
