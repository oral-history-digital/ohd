import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { initializeMapFilter, toggleMapFilter } from '../actions';
import { getMapFilter } from '../selectors';
import MapFilter from './MapFilter';

const mapStateToProps = state => ({
    filter: getMapFilter(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    initializeMapFilter,
    toggleMapFilter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapFilter);
