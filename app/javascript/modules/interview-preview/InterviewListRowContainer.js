import { connect } from 'react-redux';

import { searchInInterview } from 'modules/search';
import { setArchiveId, addRemoveArchiveId } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject } from 'modules/data';
import InterviewListRow from './InterviewListRow';

const mapStateToProps = (state, props) => {
    let project = getCurrentProject(state);
    return {
        fulltext: state.search.archive.query.fulltext,
        interviewSearchResults: state.search.interviews,
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        project: project,
        editView: state.archive.editView,
        account: state.data.accounts.current,
        selectedArchiveIds: state.archive.selectedArchiveIds,
        people: state.data.people,
        peopleStatus: state.data.statuses.people,
        languages: state.data.languages,
        languagesStatus: state.data.statuses.languages,
        collections: state.data.collections,
        collectionsStatus: state.data.statuses.collections,
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
