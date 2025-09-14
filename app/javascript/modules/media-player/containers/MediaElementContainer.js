import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    getCurrentInterview,
    getMediaStreamsForCurrentProject,
} from 'modules/data';
import { getArchiveId } from 'modules/archive';
import {
    updateMediaTime,
    updateIsPlaying,
    resetMedia,
    sendTimeChangeRequest,
    clearTimeChangeRequest,
} from '../redux/actions';
import {
    getCurrentTape,
    getTimeChangeRequest,
    getTimeChangeRequestAvailable,
} from '../redux/selectors';
import MediaElement from '../media/MediaElement';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    // Ensure mediaStreams is always an object (may be empty) so the
    // MediaElement component doesn't receive `undefined` while data
    // is still being fetched and trigger prop-type warnings.
    mediaStreams: getMediaStreamsForCurrentProject(state) || {},
    tape: getCurrentTape(state),
    timeChangeRequest: getTimeChangeRequest(state),
    timeChangeRequestAvailable: getTimeChangeRequestAvailable(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            updateMediaTime,
            updateIsPlaying,
            resetMedia,
            sendTimeChangeRequest,
            clearTimeChangeRequest,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(MediaElement);
