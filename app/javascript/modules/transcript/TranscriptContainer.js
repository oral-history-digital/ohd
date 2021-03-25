import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getArchiveId } from 'modules/archive';
import { fetchData, getCurrentInterview, getCurrentInterviewee, getProjects, getPeople } from 'modules/data';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import Transcript from './Transcript';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    interviewee: getCurrentInterviewee(state),
    people: getPeople(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
    segmentsStatus: state.data.statuses.segments,
    userContentsStatus: state.data.statuses.user_contents.all,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleTranscriptScroll,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
