import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview, getArchiveQueryFulltext, getInterviewSearchResults } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations, getEditView,
    getSelectedArchiveIds } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects, getCurrentAccount, getPeopleForCurrentProject,
    getLanguages, getCollectionsForCurrentProject, getPeopleStatus, getCollectionsStatus, getLanguagesStatus } from 'modules/data';
import InterviewListRow from './InterviewListRow';
import { getIsLoggedIn } from 'modules/account';

const mapStateToProps = (state, props) => ({
    fulltext: getArchiveQueryFulltext(state),
    interviewSearchResults: getInterviewSearchResults(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    project: getCurrentProject(state),
    editView: getEditView(state),
    account: getCurrentAccount(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    people: getPeopleForCurrentProject(state),
    peopleStatus: getPeopleStatus(state),
    languages: getLanguages(state),
    languagesStatus: getLanguagesStatus(state),
    collections: getCollectionsForCurrentProject(state),
    collectionsStatus: getCollectionsStatus(state),
    interviewee: getInterviewee(state, props),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewListRow);
