import { connect } from 'react-redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations, getEditView,
    getSelectedArchiveIds } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects, getCurrentAccount, getPeople,
    getLanguages, getCollections, getPeopleStatus, getCollectionsStatus, getLanguagesStatus } from 'modules/data';
import InterviewListRow from './InterviewListRow';

const mapStateToProps = (state, props) => {
    let project = getCurrentProject(state);
    return {
        fulltext: state.search.archive.query.fulltext,
        interviewSearchResults: state.search.interviews,
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

const mapDispatchToProps = (dispatch) => ({
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    searchInInterview: (url, searchQuery) => dispatch(searchInInterview(url, searchQuery)),
    addRemoveArchiveId: (archiveId) => dispatch(addRemoveArchiveId(archiveId)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewListRow);
