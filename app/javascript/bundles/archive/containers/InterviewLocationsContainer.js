import { connect } from 'react-redux';

import InterviewLocations from '../components/InterviewLocations';
import { handleSegmentClick, fetchInterview } from '../actions/interviewActionCreators';

import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    let interview = ArchiveUtils.getInterview(state);
    return { 
        archiveId: state.archive.archiveId,
        segments: interview && interview.segments,
        locale: state.archive.locale,
        isFetchingInterview: state.archive.isFetchingInterview
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: time => dispatch(handleSegmentClick(time)),
    fetchInterview: archiveId => dispatch(fetchInterview(archiveId))
})

// Don't forget to actually use connect!
// Note that we don't export Locations, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(InterviewLocations);
