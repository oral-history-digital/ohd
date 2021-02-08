import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import VideoPlayerButtons from './VideoPlayerButtons';

const mapStateToProps = (state) => ({
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleTranscriptScroll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerButtons);
