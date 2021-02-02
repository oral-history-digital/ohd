import { connect } from 'react-redux';

import { handleSegmentClick, getCurrentTape, getTranscriptTime } from 'modules/interview';
import { getCurrentInterview } from 'modules/data';
import SubHeading from './SubHeading';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    transcriptTime: getTranscriptTime(state),
    tape: getCurrentTape(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubHeading);
