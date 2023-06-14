import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview, getMediaStreamsForCurrentProject } from 'modules/data';
import { getArchiveId } from 'modules/archive';
import { updateMediaTime, updateIsPlaying, resetMedia, sendTimeChangeRequest,
    clearTimeChangeRequest } from '../actions';
import { getCurrentTape, getTimeChangeRequest,
    getTimeChangeRequestAvailable } from '../selectors';
import MediaElement from './MediaElement';

const mapStateToProps = state => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    mediaStreams: getMediaStreamsForCurrentProject(state),
    tape: getCurrentTape(state),
    timeChangeRequest: getTimeChangeRequest(state),
    timeChangeRequestAvailable: getTimeChangeRequestAvailable(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateMediaTime,
    updateIsPlaying,
    resetMedia,
    sendTimeChangeRequest,
    clearTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaElement);
