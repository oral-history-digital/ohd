import { connect } from 'react-redux';
//import { bindActionCreators } from 'redux'

import Locations from '../components/Locations';
import * as actionCreators from '../actions/locationsActionCreators';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  return { 
    archiveId: state.archive.archiveId,
    segmentRefLocations: state.archive.segmentRefLocations,
  }
}

//const mapDispatchToProps = (dispatch) => (
  //{ interviewActions: bindActionCreators(actionCreators, dispatch) }
//);

// Don't forget to actually use connect!
// Note that we don't export Locations, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actionCreators)(Locations);
