import { connect } from 'react-redux';

import RefTreeEntry from '../components/RefTreeEntry';
import { handleSegmentClick, handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import { getInterview } from "lib/utils";

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        transcriptScrollEnabled: getTranscriptScrollEnabled(state),
        interview: getInterview(state),
    };
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RefTreeEntry);
