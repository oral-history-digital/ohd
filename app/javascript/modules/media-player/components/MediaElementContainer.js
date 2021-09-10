import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview, getMediaStreamsForCurrentProject, getProjects } from 'modules/data';
import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { updateMediaTime, updateIsPlaying, setResolution, resetMedia,
    sendTimeChangeRequest, clearTimeChangeRequest } from '../actions';
import { getCurrentTape, getResolution, getTimeChangeRequest,
    getTimeChangeRequestAvailable } from '../selectors';
import MediaElement from './MediaElement';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    mediaStreams: getMediaStreamsForCurrentProject(state),
    projects: getProjects(state),
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
    setResolution,
    resetMedia,
    sendTimeChangeRequest,
    clearTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaElement);
