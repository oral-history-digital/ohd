import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale } from 'modules/archive';
import { sendTimeChangeRequest, getCurrentTape, getMediaTime } from 'modules/media-player';
import Heading from './Heading';

const mapStateToProps = state => ({
    locale: getLocale(state),
    mediaTime: getMediaTime(state),
    tape: getCurrentTape(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Heading);
