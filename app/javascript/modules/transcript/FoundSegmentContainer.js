import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import { setInterviewTabIndex } from 'modules/interview';
import FoundSegment from './FoundSegment';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    locale: getLocale(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
    setInterviewTabIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
