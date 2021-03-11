import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview, getMediaStreams } from 'modules/data';
import { getArchiveId, getLocale, getTranslations } from 'modules/archive';
import { setTapeAndTimeAndResolution } from '../actions';
import { getCurrentTape, getVideoResolution, getVideoTime } from '../selectors';
import MediaControls from './MediaControls';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    mediaStreams: getMediaStreams(state),
    resolution: getVideoResolution(state),
    tape: getCurrentTape(state),
    translations: getTranslations(state),
    videoTime: getVideoTime(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTapeAndTimeAndResolution,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaControls);
