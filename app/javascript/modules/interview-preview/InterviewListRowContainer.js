import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview, getArchiveQueryFulltext, getInterviewSearch } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations, getEditView,
    getSelectedArchiveIds } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects, getCurrentAccount, getPeople,
    getLanguages, getCollections, getPeopleStatus, getCollectionsStatus, getLanguagesStatus } from 'modules/data';
import InterviewListRow from './InterviewListRow';

const mapStateToProps = (state, props) => {
    let project = getCurrentProject(state);
    return {
        fulltext: getArchiveQueryFulltext(state),
        interviewSearchResults: getInterviewSearch(state),
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        translations: getTranslations(state),
        project: project,
        editView: getEditView(state),
        account: getCurrentAccount(state),
        selectedArchiveIds: getSelectedArchiveIds(state),
        people: getPeople(state),
        peopleStatus: getPeopleStatus(state),
        languages: getLanguages(state),
        languagesStatus: getLanguagesStatus(state),
        collections: getCollections(state),
        collectionsStatus: getCollectionsStatus(state),
        interviewee: getInterviewee(state, props),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewListRow);
