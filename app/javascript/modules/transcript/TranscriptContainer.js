import { getArchiveId } from 'modules/archive';
import {
    fetchData,
    getCurrentInterview,
    getCurrentIntervieweeId,
    getTranscriptFetched,
} from 'modules/data';
import { getAutoScroll } from 'modules/interview';
import { getCurrentTape, getIsIdle, getMediaTime } from 'modules/media-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Transcript from './Transcript';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    isIdle: getIsIdle(state),
    autoScroll: getAutoScroll(state),
    transcriptFetched: getTranscriptFetched(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
