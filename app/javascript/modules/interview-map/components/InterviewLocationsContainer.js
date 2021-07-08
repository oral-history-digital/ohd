import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId } from 'modules/archive';
import { fetchLocations } from '../actions';
import { getCurrentLocationsWithRefs, getInterviewMapFetched, getInterviewMapLoading,
    getInterviewMapError } from '../selectors';
import InterviewLocations from './InterviewLocations';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    currentLocations: getCurrentLocationsWithRefs(state),
    locationsFetched: getInterviewMapFetched(state),
    loading: getInterviewMapLoading(state),
    error: getInterviewMapError(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchLocations,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewLocations);
