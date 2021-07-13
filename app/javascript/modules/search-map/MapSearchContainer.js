import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getFlyoutTabsVisible, setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { searchInMap, fetchMapReferenceTypes, getMapMarkers, getIsMapSearching, getMapQuery,
    getMapReferenceTypes } from 'modules/search';
import MapSearch from './MapSearch';

const mapStateToProps = state => ({
    mapMarkers: getMapMarkers(state),
    mapReferenceTypes: getMapReferenceTypes(state),
    query: getMapQuery(state),
    isMapSearching: getIsMapSearching(state),
    flyoutTabsVisible: getFlyoutTabsVisible(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInMap,
    fetchMapReferenceTypes,
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapSearch);
