import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview, getMediaStreamsForCurrentProject } from 'modules/data';
import { getArchiveId, getLocale, getTranslations } from 'modules/archive';
import { setTape, setResolution } from '../actions';
import { getCurrentTape, getResolution, getMediaTime } from '../selectors';
import MediaControls from './MediaControls';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    mediaStreams: getMediaStreamsForCurrentProject(state),
    resolution: getResolution(state),
    tape: getCurrentTape(state),
    translations: getTranslations(state),
    mediaTime: getMediaTime(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTape,
    setResolution,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaControls);
