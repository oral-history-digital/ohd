import { connect } from 'react-redux';

import FoundSegment from '../components/FoundSegment';
import { handleSegmentClick } from '../actions/interviewActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let data = getInterview(state);
    let interview = data && data.interview;
    return {
        tape: state.archive.tape,
        interview: data && data.interview,
        transcriptTime: state.archive.transcriptTime,
        locale: state.archive.locale,
        lang: interview && interview.lang,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
