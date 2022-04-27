import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview } from 'modules/data';
import { getArchiveId, getLocale, getTranslations } from 'modules/archive';
import { setTape } from '../actions';
import { getCurrentTape, getMediaTime } from '../selectors';
import MediaControls from './MediaControls';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    tape: getCurrentTape(state),
    translations: getTranslations(state),
    mediaTime: getMediaTime(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTape,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaControls);
