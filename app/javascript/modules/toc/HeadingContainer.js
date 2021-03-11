import { connect } from 'react-redux';

import { handleSegmentClick, getCurrentTape, getTranscriptTime } from 'modules/media-player';
import Heading from './Heading';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    transcriptTime: getTranscriptTime(state),
    tape: getCurrentTape(state),
});

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Heading);
