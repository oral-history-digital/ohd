import { connect } from 'react-redux';

import Transcript from '../components/Transcript';
import { handleTranscriptScroll } from '../actions/interviewActionCreators';

import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  //let data = ArchiveUtils.getInterview(state);
  return { 
    archiveId: state.archive.archiveId,
    interview: ArchiveUtils.getInterview(state),
    transcriptTime: state.archive.transcriptTime,
    transcriptScrollEnabled: state.archive.transcriptScrollEnabled
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(Transcript);
