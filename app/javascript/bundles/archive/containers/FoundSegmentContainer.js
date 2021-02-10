import { connect } from 'react-redux';

import FoundSegment from '../components/FoundSegment';
import { handleSegmentClick, getCurrentTape } from 'modules/interview';
import { getCurrentInterview } from 'modules/data';

const mapStateToProps = (state) => {
    return {
        tape: getCurrentTape(state),
        interview: getCurrentInterview(state),
        transcriptTime: state.archive.transcriptTime,
        translations: state.archive.translations,
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
