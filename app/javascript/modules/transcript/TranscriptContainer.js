import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData } from 'modules/data';
import { getCurrentInterview, getCurrentInterviewee } from 'modules/data';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import Transcript from './Transcript';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    projectId: state.archive.projectId,
    projects: state.data.projects,
    translations: state.archive.translations,
    archiveId: state.archive.archiveId,
    interview: getCurrentInterview(state),
    interviewee: getCurrentInterviewee(state),
    people: state.data.people,
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
