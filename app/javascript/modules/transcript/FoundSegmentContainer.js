import { connect } from 'react-redux';

import { handleSegmentClick, getCurrentTape } from 'modules/video-player';
import { getCurrentInterview } from 'modules/data';
import FoundSegment from './FoundSegment';

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
