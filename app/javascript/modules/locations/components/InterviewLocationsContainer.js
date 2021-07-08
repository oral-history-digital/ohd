import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId } from 'modules/archive';
import { fetchLocations } from '../actions';
import { getCurrentLocationsWithRefs, getLocationsFetched, getLocationsLoading,
    getLocationsError } from '../selectors';
import InterviewLocations from './InterviewLocations';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    currentLocations: getCurrentLocationsWithRefs(state),
    locationsFetched: getLocationsFetched(state),
    loading: getLocationsLoading(state),
    error: getLocationsError(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchLocations,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewLocations);
