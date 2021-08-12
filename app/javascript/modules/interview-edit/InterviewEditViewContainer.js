import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getArchiveId, getSkipEmptyRows } from 'modules/archive';
import { fetchData, getCurrentInterview, getCurrentProject, getProjects,
    getSegmentsStatus } from 'modules/data';
import { getCurrentTape, getMediaTime } from 'modules/media-player';
import InterviewEditView from './InterviewEditView';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
    skipEmptyRows: getSkipEmptyRows(state),
    segmentsStatus: getSegmentsStatus(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewEditView);
