import { connect } from 'react-redux';

import InterviewLocations from '../components/InterviewLocations';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { fetchLocations } from '../actions/locationsActionCreators';

import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    let interview = ArchiveUtils.getInterview(state);
    let placeOfBirth = null;
    if (interview && interview.interview && interview.interview.interviewees){
        placeOfBirth = interview.interview.interviewees[0].place_of_birth;
        if (placeOfBirth) {
            placeOfBirth['archive_id'] = state.archive.archiveId;
            placeOfBirth['names'] = interview.interview.interviewees[0].names;
        }
    }

    return {
        archiveId: state.archive.archiveId,
        segments: interview && interview.segments,
        locations: state.locations,
        placeOfBirth: placeOfBirth,
        locale: state.archive.locale,
        translations: state.archive.translations,
        isFetchingLocations: state.archive.isFetchingLocations
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
    fetchLocations: archiveId => dispatch(fetchLocations(archiveId))
})

// Don't forget to actually use connect!
// Note that we don't export Locations, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(InterviewLocations);
