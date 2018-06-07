import {connect} from 'react-redux';

import VideoPlayer from '../components/VideoPlayer';
import {handleVideoTimeChange, handleVideoEnded, setNextTape} from '../actions/videoPlayerActionCreators';
import {handleTranscriptScroll} from '../actions/interviewActionCreators';
import {openArchivePopup} from '../actions/archivePopupActionCreators';

import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    let data = ArchiveUtils.getInterview(state);
    return {
        project: state.archive.project,
        archiveId: state.archive.archiveId,
        interview: data && data.interview,
        segments: data && data.segments,
        interviewee: data && data.interview.interviewees[0],
        tape: state.archive.tape,
        videoTime: state.archive.videoTime,
        videoStatus: state.archive.videoStatus,
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleVideoTimeChange: time => dispatch(handleVideoTimeChange(time)),
    handleVideoEnded: () => dispatch(handleVideoEnded()),
    setNextTape: () => dispatch(setNextTape()),
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
