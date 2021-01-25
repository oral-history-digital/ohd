import { connect } from 'react-redux';

import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import VideoPlayerButtons from '../components/VideoPlayerButtons';

const mapStateToProps = (state) => ({
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
});

const mapDispatchToProps = (dispatch) => ({
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerButtons);
