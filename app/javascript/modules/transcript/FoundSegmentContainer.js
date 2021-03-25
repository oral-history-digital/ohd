import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getTranslations } from 'modules/archive';
import { sendTimeChangeRequest, getCurrentTape } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import { setInterviewTabIndex } from 'modules/interview';
import FoundSegment from './FoundSegment';

const mapStateToProps = (state) => {
    return {
        tape: getCurrentTape(state),
        interview: getCurrentInterview(state),
        translations: getTranslations(state),
        locale: getLocale(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
    setInterviewTabIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
