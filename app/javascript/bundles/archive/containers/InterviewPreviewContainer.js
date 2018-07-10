import { connect } from 'react-redux';

import InterviewPreview from '../components/InterviewPreview';
import { searchInInterview } from '../actions/searchActionCreators';
import { handleSegmentClick, setTapeAndTime } from '../actions/interviewActionCreators';

const mapStateToProps = (state, ownProps) => {
  return {
      fulltext: state.search.query.fulltext,
      locale: state.archive.locale,
      translations: state.archive.translations,
      query: state.search.query,
      segments: ownProps.interview && state.search.interviews[ownProps.interview.archive_id] || {},
      project: state.archive.project
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    searchInInterview: (props) => dispatch(searchInInterview(props)),
})

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(InterviewPreview);
