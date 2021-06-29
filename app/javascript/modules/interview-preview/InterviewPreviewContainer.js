import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview, getArchiveQuery, getArchiveQueryFulltext, getInterviewSearchResults } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations, getSelectedArchiveIds } from 'modules/archive';
import { getInterviewee, getCurrentProject, getProjects, getInterviewsStatus, getPeopleForCurrentProject, getPeopleStatus, fetchData } from 'modules/data';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state, props) => ({
    fulltext: getArchiveQueryFulltext(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    projects: getProjects(state),
    query: getArchiveQuery(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    statuses: getInterviewsStatus(state),
    interviewSearchResults: getInterviewSearchResults(state),
    interviewee: getInterviewee(state, props),
    people: getPeopleForCurrentProject(state),
    peopleStatus: getPeopleStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
