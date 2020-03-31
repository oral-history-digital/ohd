import { connect } from 'react-redux';
import InterviewSearchResults from '../components/InterviewSearchResults';
import { searchInInterview } from '../actions/searchActionCreators';
import { setTapeAndTime } from '../actions/interviewActionCreators';
import { setArchiveId } from '../actions/archiveActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    return {
        archiveId: state.archive.archiveId,
        tape: state.interview.tape,
        transcriptTime: state.interview.transcriptTime,
        locale: state.archive.locale,
        translations: state.archive.translations,
        isInterviewSearching: state.search.isInterviewSearching,
        fulltext: state.search.archive.query.fulltext,
    }
}


const mapDispatchToProps = (dispatch) => ({
    searchInInterview: (url, searchQuery) => dispatch(searchInInterview(url, searchQuery)),
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
})


// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(InterviewSearchResults);
