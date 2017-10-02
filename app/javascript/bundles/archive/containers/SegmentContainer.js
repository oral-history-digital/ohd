import { connect } from 'react-redux';

import Segment from '../components/Segment';
import { handleSegmentClick } from '../actions/interviewActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  return { 
    transcriptTime: state.archive.transcriptTime,
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleSegmentClick: time => dispatch(handleSegmentClick(time)),
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(Segment);
