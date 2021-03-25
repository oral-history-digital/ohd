import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getSelectedInterviewEditViewColumns, getProjectId, getTranslations, getArchiveId,
    getSkipEmptyRows, getEditView } from 'modules/archive';
import { fetchData, getCurrentInterview, getCurrentProject } from 'modules/data';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import InterviewEditView from './InterviewEditView';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: state.data.projects,
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
    skipEmptyRows: getSkipEmptyRows(state),
    segmentsStatus: state.data.statuses.segments,
    selectedInterviewEditViewColumns: getSelectedInterviewEditViewColumns(state),
    account: state.data.accounts.current,
    editView: getEditView(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleTranscriptScroll,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewEditView);
