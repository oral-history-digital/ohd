import { connect } from 'react-redux';

import InterviewWorkflowRow from '../components/InterviewWorkflowRow';
import { searchInInterview } from 'modules/search';
import { setTapeAndTime } from 'modules/interview';
import { setArchiveId, addRemoveArchiveId } from 'modules/archive';
import { fetchData } from '../actions/dataActionCreators';
import { getProject } from 'lib/utils';

const mapStateToProps = (state, ownProps) => {
    let project = getProject(state);
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
        interviews: state.data.interviews,
        tasks: state.data.tasks,
        tasksStatus: state.data.statuses.tasks,
        userAccounts: state.data.accounts,
        userAccountsStatus: state.data.statuses.accounts
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    searchInInterview: (url, searchQuery) => dispatch(searchInInterview(url, searchQuery)),
    addRemoveArchiveId: (archiveId) => dispatch(addRemoveArchiveId(archiveId)),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InterviewWorkflowRow);
