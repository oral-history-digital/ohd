import { connect } from 'react-redux';
import { handleTranscriptScroll } from '../actions/interviewActionCreators';

import VideoPlayerButtons from '../components/VideoPlayerButtons';

const mapStateToProps = (state) => ({
    transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
});

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerButtons);
