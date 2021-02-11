import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { handleSegmentClick, handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/video-player';
import { getCurrentInterview } from 'modules/data';
import { getLocale } from 'modules/archive';
import RefTreeEntry from './RefTreeEntry';

const mapStateToProps = state => ({
    locale: getLocale(state),
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleSegmentClick,
    handleTranscriptScroll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RefTreeEntry);
