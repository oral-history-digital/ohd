import {connect} from 'react-redux';

import { handleVideoTimeChange, handleVideoEnded, setNextTape, setTapeAndTimeAndResolution } from '../actions';
import { getFlyoutTabsVisible } from 'modules/flyout-tabs';
import { getCurrentProject, getCurrentInterview, getCurrentInterviewee } from 'modules/data';
import { getCurrentTape, getTranscriptScrollEnabled, getVideoResolution, getVideoStatus, getVideoTime } from '../selectors';
import VideoPlayer from './VideoPlayer';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        interview: getCurrentInterview(state),
        interviewee: getCurrentInterviewee(state),
        project: project,
        archiveId: state.archive.archiveId,
        projectId: state.archive.projectId,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        tape: getCurrentTape(state),
        videoTime: getVideoTime(state),
        videoStatus: getVideoStatus(state),
        transcriptScrollEnabled: getTranscriptScrollEnabled(state),
        people: state.data.people,
        mediaStreams: state.data.media_streams,
        resolution: getVideoResolution(state),
        account: state.data.accounts.current,
        editView: state.archive.editView,
        flyoutTabsVisible: getFlyoutTabsVisible(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleVideoTimeChange: time => dispatch(handleVideoTimeChange(time)),
    handleVideoEnded: () => dispatch(handleVideoEnded()),
    setNextTape: () => dispatch(setNextTape()),
    setTapeAndTimeAndResolution: (tape, time, resolution) => dispatch(setTapeAndTimeAndResolution(tape, time, resolution)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
