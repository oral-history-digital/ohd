import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData } from 'modules/data';
import { getProject } from 'lib/utils';
import { getCurrentInterview } from 'modules/data';
import { handleTranscriptScroll, setActualSegment, getCurrentTape, getTranscriptScrollEnabled, getTranscriptTime } from 'modules/interview';
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
    project: getProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleTranscriptScroll,
    setActualSegment,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewEditView);