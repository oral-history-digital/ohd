import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId } from 'modules/archive';
import {
    fetchData,
    getCurrentInterview,
    getCurrentIntervieweeId,
    getTranscriptFetched,
} from 'modules/data';
import { getCurrentTape, getMediaTime, getIsIdle } from 'modules/media-player';
import { getAutoScroll } from 'modules/interview';
import Transcript from './Transcript';

const mapStateToProps = (state, props) => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    isIdle: getIsIdle(state),
    autoScroll: getAutoScroll(state),
    transcriptFetched: getTranscriptFetched(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
