import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getInterviewee } from 'lib/utils';
import { searchInArchive } from 'modules/search';
import { getCurrentInterview, getProjects } from 'modules/data';
import { getArchiveId, getLocale, getTranslations, getProjectId } from 'modules/archive';
import InterviewDetailsLeftSide from './InterviewDetailsLeftSide';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    foundInterviews: state.search.archive.foundInterviews,
    interviewee: getInterviewee({interview: getCurrentInterview(state), people: state.data.people}),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    query: state.search.archive.query,
    sortedArchiveIds: state.search.archive.sortedArchiveIds,
    translations: getTranslations(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    searchInArchive,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewDetailsLeftSide);
