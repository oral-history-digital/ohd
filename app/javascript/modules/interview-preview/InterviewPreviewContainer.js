import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview, getArchiveQuery, getArchiveQueryFulltext, getInterviewSearch } from 'modules/search';
import { setArchiveId, addRemoveArchiveId, getLocale, getProjectId, getTranslations,
    getSelectedArchiveIds, getEditView } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject, getProjects, getCurrentAccount, getPeople,
    getLanguages, getPeopleStatus, getInterviewsStatus, getLanguagesStatus } from 'modules/data';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state, props) => {
    let project = getCurrentProject(state);
    return {
        fulltext: getArchiveQueryFulltext(state),
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: project,
        projects: getProjects(state),
        translations: getTranslations(state),
        query: getArchiveQuery(state),
        selectedArchiveIds: getSelectedArchiveIds(state),
        statuses: getInterviewsStatus(state),
        interviewSearchResults: getInterviewSearch(state),
        editView: getEditView(state),
        account: getCurrentAccount(state),
        people: getPeople(state),
        peopleStatus: getPeopleStatus(state),
        languages: getLanguages(state),
        languagesStatus: getLanguagesStatus(state),
        interviewee: getInterviewee(state, props),
        optionsScope: 'search_facets' // for the humanReadable function
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
