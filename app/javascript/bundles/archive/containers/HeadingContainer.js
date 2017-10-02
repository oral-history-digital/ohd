import { connect } from 'react-redux';

import Heading from '../components/Heading';
import { handleSegmentClick } from '../actions/interviewActionCreators';

const mapDispatchToProps = (dispatch) => ({
  handleSegmentClick: time => dispatch(handleSegmentClick(time)),
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(null, mapDispatchToProps)(Heading);
