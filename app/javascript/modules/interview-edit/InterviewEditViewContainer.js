import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentInterview, getCurrentProject } from 'modules/data';
import { getCurrentTape, getTranscriptTime } from 'modules/media-player';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import InterviewEditView from './InterviewEditView';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    projectId: state.archive.projectId,
    projects: state.data.projects,
    translations: state.archive.translations,
    archiveId: state.archive.archiveId,
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    transcriptTime: getTranscriptTime(state),
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
    skipEmptyRows: state.archive.skipEmptyRows,
    segmentsStatus: state.data.statuses.segments,
    selectedInterviewEditViewColumns: state.archive.selectedInterviewEditViewColumns,
    account: state.data.accounts.current,
    editView: state.archive.editView,
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleTranscriptScroll,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewEditView);
