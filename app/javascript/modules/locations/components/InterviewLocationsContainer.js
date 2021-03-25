import { connect } from 'react-redux';

import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getProjects } from 'modules/data';
import { fetchLocations } from '../actions';
import { getCurrentLocationsWithRefs, getLocationsFetched } from '../selectors';
import InterviewLocations from './InterviewLocations';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    currentLocations: getCurrentLocationsWithRefs(state),
    locationsFetched: getLocationsFetched(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = (dispatch) => ({
    fetchLocations: (url, archiveId) => dispatch(fetchLocations(url, archiveId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewLocations);
