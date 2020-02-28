import { connect } from 'react-redux';

import InterviewPreview from '../components/InterviewPreview';
import { searchInInterview } from '../actions/searchActionCreators';
import { setTapeAndTime } from '../actions/interviewActionCreators';
import { addRemoveArchiveId } from '../actions/archiveActionCreators';
import { getCookie } from '../../../lib/utils';

const mapStateToProps = (state, ownProps) => {
    return {
        fulltext: state.search.archive.query.fulltext,
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        query: state.search.archive.query,
        selectedArchiveIds: state.archive.selectedArchiveIds,
        statuses: state.data.statuses.interviews,
        interviewSearchResults: state.search.interviews,
        editView: state.archive.editView,
        account: state.data.accounts.current,
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
export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
