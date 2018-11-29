import { connect } from 'react-redux';

import FoundSegment from '../components/FoundSegment';
import { handleSegmentClick } from '../actions/interviewActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = getInterview(state);
    return {
        tape: state.archive.tape,
        interview: interview,
        transcriptTime: state.archive.transcriptTime,
        translations: state.archive.translations,
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
