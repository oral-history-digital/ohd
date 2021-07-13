import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocationCountByReferenceType, getMapFilter, toggleMapFilter } from 'modules/search';
import MapFilter from './MapFilter';

const mapStateToProps = state => ({
    locationCountByReferenceType: getLocationCountByReferenceType(state),
    filter: getMapFilter(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    toggleMapFilter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapFilter);
