import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getArchiveId } from 'modules/archive';
import { fetchData, getCurrentInterview, getCurrentInterviewee, getProjects, getTranscriptFetched,
    getTranscriptLocale, getHasTranscript, getUserContentsStatus } from 'modules/data';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import { getAutoScroll } from 'modules/interview';
import Transcript from './Transcript';
import {  } from '../data';

const mapStateToProps = (state, props) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    interviewee: getCurrentInterviewee(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    autoScroll: getAutoScroll(state),
    transcriptFetched: getTranscriptFetched(state),
    transcriptLocale: getTranscriptLocale(state, props),
    hasTranscript: getHasTranscript(state, props),
    userContentsStatus: getUserContentsStatus(state).all,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
