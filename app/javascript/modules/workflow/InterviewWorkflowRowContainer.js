import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { searchInInterview } from 'modules/search';
import { setTapeAndTime } from 'modules/video-player';
import { setArchiveId, addRemoveArchiveId } from 'modules/archive';
import { fetchData, getInterviewee, getCurrentProject } from 'modules/data';
import InterviewWorkflowRow from './InterviewWorkflowRow';

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
        interviews: state.data.interviews,
        interviewee: getInterviewee(state, props),
        tasks: state.data.tasks,
        tasksStatus: state.data.statuses.tasks,
        userAccounts: state.data.accounts,
        userAccountsStatus: state.data.statuses.accounts
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    setTapeAndTime,
    setArchiveId,
    searchInInterview,
    addRemoveArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewWorkflowRow);
