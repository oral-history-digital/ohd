import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInArchive, getArchiveQuery, getArchiveFoundInterviews } from 'modules/search';
import { getCurrentInterview, getProjects, getCurrentInterviewee } from 'modules/data';
import { getArchiveId, getLocale, getTranslations, getProjectId } from 'modules/archive';
import InterviewDetailsLeftSide from './InterviewDetailsLeftSide';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    foundInterviews: getArchiveFoundInterviews(state),
    interviewee: getCurrentInterviewee(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: getArchiveQuery(state),
    sortedArchiveIds: state.search.archive.sortedArchiveIds,
    translations: getTranslations(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInArchive,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewDetailsLeftSide);
