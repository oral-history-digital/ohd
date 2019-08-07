import { connect } from 'react-redux';

import InterviewListRow from '../components/InterviewListRow';
import { searchInInterview } from '../actions/searchActionCreators';
import { setTapeAndTime } from '../actions/interviewActionCreators';
import { addRemoveArchiveId } from '../actions/archiveActionCreators';
import { getCookie } from '../../../lib/utils';

const mapStateToProps = (state, ownProps) => {
  return {
      fulltext: state.search.query && state.search.query.fulltext || '',
      locale: state.archive.locale,
      translations: state.archive.translations,
      listColumns: state.archive.listColumns,
      editView: getCookie('editView'),
      account: state.data.accounts.current,
      selectedArchiveIds: state.archive.selectedArchiveIds,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    searchInInterview: (props) => dispatch(searchInInterview(props)),
    addRemoveArchiveId: (archiveId) => dispatch(addRemoveArchiveId(archiveId)),
})

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(InterviewListRow);
