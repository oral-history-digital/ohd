import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getMapReferenceTypes, getMapFilter, toggleMapFilter } from 'modules/search';
import MapFilter from './MapFilter';

const mapStateToProps = state => ({
    mapReferenceTypes: getMapReferenceTypes(state),
    filter: getMapFilter(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    toggleMapFilter,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapFilter);
