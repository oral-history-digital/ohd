import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendTimeChangeRequest, getCurrentTape, getMediaTime } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import { getLocale, getTranslations } from 'modules/archive';
import SubHeading from './SubHeading';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    mediaTime: getMediaTime(state),
    tape: getCurrentTape(state),
    interview: getCurrentInterview(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubHeading);
