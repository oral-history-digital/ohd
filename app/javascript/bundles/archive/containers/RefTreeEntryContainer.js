import { connect } from 'react-redux';

import RefTreeEntry from '../components/RefTreeEntry';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import {handleTranscriptScroll} from "../actions/interviewActionCreators";
import {getInterview } from "../../../lib/utils";

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        transcriptScrollEnabled: state.interview.transcriptScrollEnabled,
        interview: getInterview(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
    handleTranscriptScroll: bool => dispatch(handleTranscriptScroll(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RefTreeEntry);
