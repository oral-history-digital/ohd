import {connect} from 'react-redux';

import VideoPlayer from '../components/VideoPlayer';
import {handleVideoTimeChange, handleVideoEnded, setNextTape, setTapeAndTimeAndResolution} from '../actions/videoPlayerActionCreators';
import {openArchivePopup} from '../actions/archivePopupActionCreators';
import { getProject } from 'lib/utils';
import { getFlyoutTabsVisible } from '../selectors/flyoutTabsSelectors';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        project: project && project.identifier,
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        tape: state.interview.tape,
        videoTime: state.interview.videoTime,
        videoStatus: state.interview.videoStatus,
        currentSegment: state.interview.currentSegment,
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
        people: state.data.people,
        contributionTypes: state.archive.contributionTypes,
        mediaStreams: state.archive.mediaStreams,
        resolution: state.interview.resolution,
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
