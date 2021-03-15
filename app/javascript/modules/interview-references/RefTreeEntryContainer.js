import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendTimeChangeRequest } from 'modules/media-player';
import { handleTranscriptScroll, getTranscriptScrollEnabled } from 'modules/interview';
import { getCurrentInterview } from 'modules/data';
import { getLocale } from 'modules/archive';
import RefTreeEntry from './RefTreeEntry';

const mapStateToProps = state => ({
    locale: getLocale(state),
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
    handleTranscriptScroll,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RefTreeEntry);
