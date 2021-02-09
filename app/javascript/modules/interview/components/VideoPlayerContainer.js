import {connect} from 'react-redux';

import VideoPlayer from './VideoPlayer';
import { handleVideoTimeChange, handleVideoEnded, setNextTape, setTapeAndTimeAndResolution } from '../actions';
import { openArchivePopup } from 'modules/ui';
import { getProject } from 'lib/utils';
import { getFlyoutTabsVisible } from 'modules/flyout-tabs';
import { getCurrentInterview } from 'modules/data';
import { getCurrentTape, getTranscriptScrollEnabled, getVideoResolution, getVideoStatus, getVideoTime } from '../selectors';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        interview: getCurrentInterview(state),
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
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
