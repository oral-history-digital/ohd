import { connect } from 'react-redux';

import Heading from '../components/Heading';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import {getInterview } from '../../../lib/utils'

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        transcriptTime: state.interview.transcriptTime,
        tape: state.interview.tape,
        interview: getInterview(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(Heading);
