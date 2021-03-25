import { connect } from 'react-redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations,
    getSelectedArchiveIds, getEditView } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects, getCurrentAccount, getPeople,
    getLanguages } from 'modules/data';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state, props) => {
    let project = getCurrentProject(state);
    return {
        fulltext: state.search.archive.query.fulltext,
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: project,
        projects: getProjects(state),
        translations: getTranslations(state),
        query: state.search.archive.query,
        selectedArchiveIds: getSelectedArchiveIds(state),
        statuses: state.data.statuses.interviews,
        interviewSearchResults: state.search.interviews,
        editView: getEditView(state),
        account: getCurrentAccount(state),
        people: getPeople(state),
        peopleStatus: state.data.statuses.people,
        languages: getLanguages(state),
        languagesStatus: state.data.statuses.languages,
        interviewee: getInterviewee(state, props),
        optionsScope: 'search_facets' // for the humanReadable function
    }
}

const mapDispatchToProps = (dispatch) => ({
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    searchInInterview: (url, searchQuery) => dispatch(searchInInterview(url, searchQuery)),
    addRemoveArchiveId: (archiveId) => dispatch(addRemoveArchiveId(archiveId)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
