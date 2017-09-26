import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import Interview from '../components/Interview';
import * as actionCreators from '../actions/interviewActionCreators';

//const getInterview = (interviews, archiveId) => {
  //return interviews[archiveId];
//}

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => (
  { interviews: state.interviews }
);
const mapDispatchToProps = (dispatch) => (
  { interviewActions: bindActionCreators(actionCreators, dispatch) }
);
//const mapStateToProps = (state) => ({ interview: getInterview(state.interviews, state.archiveId) });

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actionCreators)(Interview);
//export default connect(mapStateToProps, interviewActions)(Interview);
