import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId } from 'modules/archive';
import {
    fetchData,
    getCurrentInterview,
    getCurrentIntervieweeId,
    getHasTranscript,
    getTranscriptFetched,
    getTranscriptLocale
} from 'modules/data';
import { getCurrentTape, getMediaTime, getIsIdle } from 'modules/media-player';
import { getAutoScroll } from 'modules/interview';
import { getWorkbookIsLoading, getWorkbookLoaded, fetchWorkbook } from 'modules/workbook';
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
    transcriptLocale: getTranscriptLocale(state, props),
    hasTranscript: getHasTranscript(state, props),
    workbookIsLoading: getWorkbookIsLoading(state),
    workbookLoaded: getWorkbookLoaded(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    fetchWorkbook,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
