import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview, getMediaStreams } from 'modules/data';
import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { updateMediaTime, updateIsPlaying, setTape, setResolution, resetMedia,
    clearTimeChangeRequest } from '../actions';
import { getCurrentTape, getResolution, getTimeChangeRequest,
    getTimeChangeRequestAvailable } from '../selectors';
import MediaElement from './MediaElement';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    mediaStreams: getMediaStreams(state),
    projectId: getProjectId(state),
    resolution: getResolution(state),
    tape: getCurrentTape(state),
    timeChangeRequest: getTimeChangeRequest(state),
    timeChangeRequestAvailable: getTimeChangeRequestAvailable(state),
    translations: getTranslations(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateMediaTime,
    updateIsPlaying,
    setTape,
    setResolution,
    resetMedia,
    clearTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaElement);
