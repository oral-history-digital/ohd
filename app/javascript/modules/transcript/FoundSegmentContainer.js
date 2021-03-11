import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { handleSegmentClick, getCurrentTape } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import { setInterviewTabIndex } from 'modules/interview';
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

const mapDispatchToProps = dispatch => bindActionCreators({
    handleSegmentClick,
    setInterviewTabIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
