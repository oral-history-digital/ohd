import { connect } from 'react-redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, addRemoveArchiveId } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject } from 'modules/data';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state, props) => {
    let project = getCurrentProject(state);
    return {
        fulltext: state.search.archive.query.fulltext,
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        project: project,
        projects: state.data.projects,
        translations: state.archive.translations,
        query: state.search.archive.query,
        selectedArchiveIds: state.archive.selectedArchiveIds,
        statuses: state.data.statuses.interviews,
        interviewSearchResults: state.search.interviews,
        editView: state.archive.editView,
        account: state.data.accounts.current,
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        languages: state.data.languages,
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
