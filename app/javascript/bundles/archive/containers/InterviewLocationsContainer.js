import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import InterviewLocations from '../components/InterviewLocations';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { fetchLocations } from '../actions/locationsActionCreators';
import { fetchData } from '../actions/dataActionCreators';
import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    let birthLocation = null;
    if (interview && interview.interview && interview.interview.interviewees){
        birthLocation = interview.interview.interviewees[0].birth_location;
        if (birthLocation) {
            birthLocation['archive_id'] = state.archive.archiveId;
            birthLocation['names'] = interview.interview.interviewees[0].names;
        }
    }

    return {
        archiveId: state.archive.archiveId,
        segments: interview && interview.segments,
        locations: state.locations,
        birthLocation: birthLocation,
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        isFetchingLocations: state.archive.isFetchingLocations
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
    fetchLocations: (url, archiveId) => dispatch(fetchLocations(url, archiveId)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(InterviewLocations));
