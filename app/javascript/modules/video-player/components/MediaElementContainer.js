import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview, getMediaStreams } from 'modules/data';
import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { handleVideoTimeChange, handleVideoEnded, setNextTape, setTapeAndTimeAndResolution } from '../actions';
import { getCurrentTape, getVideoResolution, getVideoStatus, getVideoTime } from '../selectors';
import MediaElement from './MediaElement';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    mediaStreams: getMediaStreams(state),
    projectId: getProjectId(state),
    resolution: getVideoResolution(state),
    tape: getCurrentTape(state),
    translations: getTranslations(state),
    videoStatus: getVideoStatus(state),
    videoTime: getVideoTime(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleVideoEnded,
    handleVideoTimeChange,
    setNextTape,
    setTapeAndTimeAndResolution,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaElement);
