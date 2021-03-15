import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendTimeChangeRequest, getCurrentTape, getMediaTime } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import SubHeading from './SubHeading';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    mediaTime: getMediaTime(state),
    tape: getCurrentTape(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubHeading);
