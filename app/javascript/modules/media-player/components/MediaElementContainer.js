import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview, getMediaStreams } from 'modules/data';
import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { handleTimeChange, setNextTape, setTapeAndTimeAndResolution } from '../actions';
import { getCurrentTape, getResolution, getMediaStatus, getMediaTime } from '../selectors';
import MediaElement from './MediaElement';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    mediaStreams: getMediaStreams(state),
    projectId: getProjectId(state),
    resolution: getResolution(state),
    tape: getCurrentTape(state),
    translations: getTranslations(state),
    mediaStatus: getMediaStatus(state),
    mediaTime: getMediaTime(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    handleTimeChange,
    setNextTape,
    setTapeAndTimeAndResolution,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaElement);
