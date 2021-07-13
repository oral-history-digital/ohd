import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocationCountByReferenceType } from 'modules/search';
import { initializeMapFilter, toggleMapFilter } from '../actions';
import { getMapFilter } from '../selectors';
import MapFilter from './MapFilter';

const mapStateToProps = state => ({
    locationCountByReferenceType: getLocationCountByReferenceType(state),
    filter: getMapFilter(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    initializeMapFilter,
    toggleMapFilter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapFilter);
