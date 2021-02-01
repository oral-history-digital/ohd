import { connect } from 'react-redux';

import Heading from '../components/Heading';
import { openArchivePopup } from 'modules/ui';
import { handleSegmentClick, getCurrentTape, getTranscriptTime } from 'modules/interview';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    transcriptTime: getTranscriptTime(state),
    tape: getCurrentTape(state),
});

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Heading);
