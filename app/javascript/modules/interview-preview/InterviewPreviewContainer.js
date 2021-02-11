import { connect } from 'react-redux';

import { searchInInterview } from 'modules/search';
import { setTapeAndTime } from 'modules/video-player';
import { setArchiveId, addRemoveArchiveId } from 'modules/archive';
import { fetchData } from 'modules/data';
import { getProject } from 'lib/utils';
import InterviewPreview from './InterviewPreview';

const mapStateToProps = (state) => {
    let project = getProject(state);
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
        optionsScope: 'search_facets' // for the humanReadable function
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    searchInInterview: (url, searchQuery) => dispatch(searchInInterview(url, searchQuery)),
    addRemoveArchiveId: (archiveId) => dispatch(addRemoveArchiveId(archiveId)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
