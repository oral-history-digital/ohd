import { connect } from 'react-redux';

import VideoPlayer from '../components/VideoPlayer';
import * as actionCreators from '../actions/videoPlayerActionCreators';

import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  let data = ArchiveUtils.getInterview(state);
  return { 
    archiveId: state.archive.archiveId,
    interview: data && data.interview,
    videoTime: state.archive.videoTime,
    videoStatus: state.archive.videoStatus
  }
}

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, actionCreators)(VideoPlayer);
