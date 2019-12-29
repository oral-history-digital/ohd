import { connect } from 'react-redux';

import InterviewListRow from '../components/InterviewListRow';
import { searchInInterview } from '../actions/searchActionCreators';
import { setTapeAndTime } from '../actions/interviewActionCreators';
import { addRemoveArchiveId } from '../actions/archiveActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state, ownProps) => {
    let project = getProject(state);
    return {
        fulltext: state.search.query && state.search.query.fulltext || '',
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        project: project,
        editView: state.archive.editView,
        account: state.data.accounts.current,
        selectedArchiveIds: state.archive.selectedArchiveIds,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    searchInInterview: (url, searchQuery) => dispatch(searchInInterview(url, searchQuery)),
    addRemoveArchiveId: (archiveId) => dispatch(addRemoveArchiveId(archiveId)),
})

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(InterviewListRow);
