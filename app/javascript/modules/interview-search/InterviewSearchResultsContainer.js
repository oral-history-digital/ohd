import { connect } from 'react-redux';

import { getCurrentInterviewSearchResults, getSegmentResults, getRegistryEntryResults,
    getPhotoResults, getBiographyResults, getAnnotationResults, getNumObservationsResults } from 'modules/search';
import { getCurrentInterview } from 'modules/data';
import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    currentInterviewSearchResults: getCurrentInterviewSearchResults(state),
    segmentResults: getSegmentResults(state),
    registryEntryResults: getRegistryEntryResults(state),
    photoResults: getPhotoResults(state),
    biographyResults: getBiographyResults(state),
    annotationResults: getAnnotationResults(state),
    numObservationsResults: getNumObservationsResults(state),
});

export default connect(mapStateToProps)(InterviewSearchResults);
