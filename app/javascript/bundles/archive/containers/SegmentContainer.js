import { connect } from 'react-redux';

import Segment from '../components/Segment';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

import ArchiveUtils from '../../../lib/utils';

// Which part of the Redux global state does our component want to receive as props?
const mapStateToProps = (state) => {
  let data = ArchiveUtils.getInterview(state);
  return { 
    transcriptTime: state.archive.transcriptTime,
    locale: state.archive.locale,
    interview: data && data.interview
  }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: time => dispatch(handleSegmentClick(time)),
    openArchivePopup: (title, content, className, closeOnOverlayClick, buttons ) => 
        dispatch(openArchivePopup(title, content, className, closeOnOverlayClick, buttons ))
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(Segment);
