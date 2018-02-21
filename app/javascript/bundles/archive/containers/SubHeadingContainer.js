import { connect } from 'react-redux';

import SubHeading from '../components/SubHeading';
import { handleSegmentClick } from '../actions/interviewActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        transcriptTime: state.archive.transcriptTime,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
})

// Don't forget to actually use connect!
// Note that we don't export Interview, but the redux "connected" version of it.
// See https://github.com/reactjs/react-redux/blob/master/docs/api.md#examples
export default connect(mapStateToProps, mapDispatchToProps)(SubHeading);
