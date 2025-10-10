import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId } from 'modules/archive';
import {
    getCurrentInterview,
    getCurrentIntervieweeId,
    getTranscriptFetched,
} from 'modules/data';
import { getAutoScroll } from 'modules/interview';
import { getCurrentTape, getIsIdle, getMediaTime } from 'modules/media-player';
import Transcript from './Transcript';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    isIdle: getIsIdle(state),
    autoScroll: getAutoScroll(state),
});

export default connect(mapStateToProps)(Transcript);
