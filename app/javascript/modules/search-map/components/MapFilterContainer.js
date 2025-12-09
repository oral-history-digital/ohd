import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { initializeMapFilter, toggleMapFilter } from '../actions';
import MapFilter from './MapFilter';

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            initializeMapFilter,
            toggleMapFilter,
        },
        dispatch
    );

export default connect(undefined, mapDispatchToProps)(MapFilter);
