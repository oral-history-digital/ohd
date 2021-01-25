import {connect} from 'react-redux';

import VideoPlayer from './VideoPlayer';
import { handleVideoTimeChange, handleVideoEnded, setNextTape, setTapeAndTimeAndResolution } from '../actions';
import { openArchivePopup } from 'bundles/archive/actions/archivePopupActionCreators';
import { getProject } from 'lib/utils';
import { getFlyoutTabsVisible } from 'modules/flyout-tabs';
import { getCurrentInterview } from 'bundles/archive/selectors/dataSelectors';
import { getCurrentTape, getTranscriptScrollEnabled, getVideoResolution, getVideoStatus, getVideoTime } from '../selectors';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        interview: getCurrentInterview(state),
        project: project && project.identifier,
        archiveId: state.archive.archiveId,
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        tape: getCurrentTape(state),
        videoTime: getVideoTime(state),
        videoStatus: getVideoStatus(state),
        transcriptScrollEnabled: getTranscriptScrollEnabled(state),
        people: state.data.people,
        contributionTypes: state.archive.contributionTypes,
        mediaStreams: state.archive.mediaStreams,
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
