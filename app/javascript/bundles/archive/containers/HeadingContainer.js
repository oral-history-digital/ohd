import { connect } from 'react-redux';

import Heading from '../components/Heading';
import { handleSegmentClick } from '../actions/interviewActionCreators';

//import ArchiveUtils from '../../../lib/utils';

//// Which part of the Redux global state does our component want to receive as props?
//const mapStateToProps = (state) => {
  //let data = ArchiveUtils.getInterview(state);
  //return { 
    //interview: data && data.interview,
  //}
//}

const mapDispatchToProps = (dispatch) => ({
  handleSegmentClick: time => dispatch(handleSegmentClick(time)),
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(null, mapDispatchToProps)(Heading);
//export default connect(null, handleSegmentClick)(Heading);
