import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendTimeChangeRequest, getCurrentTape, getMediaTime } from 'modules/media-player';
import { getLocale, getTranslations } from 'modules/archive';
import Heading from './Heading';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    mediaTime: getMediaTime(state),
    tape: getCurrentTape(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Heading);
