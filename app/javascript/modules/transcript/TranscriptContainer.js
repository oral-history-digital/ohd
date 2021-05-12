import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getArchiveId } from 'modules/archive';
import { fetchData, getCurrentInterview, getCurrentInterviewee, getProjects, getPeople, getSegmentsStatus, getUserContentsStatus } from 'modules/data';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import { getAutoScroll } from 'modules/interview';
import Transcript from './Transcript';

const mapStateToProps = state => ({
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
    segmentsStatus: getSegmentsStatus(state),
    userContentsStatus: getUserContentsStatus(state).all,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
