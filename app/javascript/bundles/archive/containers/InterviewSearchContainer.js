import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux'

import InterviewSearch from '../components/InterviewSearch';
import { searchInInterview } from '../actions/searchActionCreators';
import { handleSegmentClick } from '../actions/interviewActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
    return {
        segments: state.archive.segments,
        archiveId: state.archive.archiveId
    }
}

const mapActionsToProps = () => ({
  searchInInterview: searchInInterview,
  handleSegmentClick: handleSegmentClick
})

//const mapDispatchToProps = (dispatch) => (
//{ interviewActions: bindActionCreators(actionCreators, dispatch) }
//);

// Don't forget to actually use connect!
// Note that we don't export Search, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapActionsToProps)(InterviewSearch);
