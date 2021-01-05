import { connect } from 'react-redux';

import InterviewLocations from '../components/InterviewLocations';
import { fetchLocations } from '../actions/locationsActionCreators';
import { getCurrentLocationsWithRefs, getLocationsFetched } from '../selectors/locationsSelectors';
import { getArchiveId, getLocale, getProjectId, getTranslations } from '../selectors/archiveSelectors';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    currentLocations: getCurrentLocationsWithRefs(state),
    locationsFetched: getLocationsFetched(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = (dispatch) => ({
    fetchLocations: (url, archiveId) => dispatch(fetchLocations(url, archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewLocations);
