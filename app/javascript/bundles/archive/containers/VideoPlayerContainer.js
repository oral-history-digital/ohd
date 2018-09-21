import {connect} from 'react-redux';

import VideoPlayer from '../components/VideoPlayer';
import {handleVideoTimeChange, handleVideoEnded, setNextTape, setTapeAndTime} from '../actions/videoPlayerActionCreators';
import {handleTranscriptScroll} from '../actions/interviewActionCreators';
import {openArchivePopup} from '../actions/archivePopupActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    return {
        project: state.archive.project,
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
        tape: state.interview.tape,
        videoTime: state.interview.videoTime,
        videoStatus: state.interview.videoStatus,
        actualSegment: state.interview.actualSegment,
        interviewee: interview && state.data.people && state.data.people[interview.interviewee_id],
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleVideoTimeChange: time => dispatch(handleVideoTimeChange(time)),
    handleVideoEnded: () => dispatch(handleVideoEnded()),
    setNextTape: () => dispatch(setNextTape()),
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
