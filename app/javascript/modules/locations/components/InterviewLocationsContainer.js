import { connect } from 'react-redux';

import { getArchiveId, getLocale, getProjectId, getTranslations } from 'bundles/archive/selectors/archiveSelectors';
import { fetchLocations } from '../actions';
import { getCurrentLocationsWithRefs, getLocationsFetched } from '../selectors';
import InterviewLocations from './InterviewLocations';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    currentLocations: getCurrentLocationsWithRefs(state),
    locationsFetched: getLocationsFetched(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
        projects: state.data.projects,
    translations: getTranslations(state),
});

const mapDispatchToProps = (dispatch) => ({
    fetchLocations: (url, archiveId) => dispatch(fetchLocations(url, archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewLocations);
