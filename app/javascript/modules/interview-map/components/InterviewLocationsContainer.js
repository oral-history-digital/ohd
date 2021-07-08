import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId } from 'modules/archive';
import { fetchLocations } from '../actions';
import { getInterviewMapMarkers, getInterviewMapLoading, getInterviewMapError } from '../selectors';
import InterviewLocations from './InterviewLocations';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    markers: getInterviewMapMarkers(state),
    loading: getInterviewMapLoading(state),
    error: getInterviewMapError(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchLocations,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewLocations);
