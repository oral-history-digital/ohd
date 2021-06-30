import { connect } from 'react-redux';

import { getCurrentInterviewSearchResults, getSegmentResults, getRegistryEntryResults,
    getPhotoResults, getBiographyResults, getAnnotationResults, getObservationsResults } from 'modules/search';
import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = state => ({
    currentInterviewSearchResults: getCurrentInterviewSearchResults(state),
    segmentResults: getSegmentResults(state),
    registryEntryResults: getRegistryEntryResults(state),
    photoResults: getPhotoResults(state),
    biographyResults: getBiographyResults(state),
    annotationResults: getAnnotationResults(state),
    observationsResults: getObservationsResults(state),
});

export default connect(mapStateToProps)(InterviewSearchResults);
