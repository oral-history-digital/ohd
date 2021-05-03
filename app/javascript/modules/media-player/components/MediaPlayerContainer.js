import {connect} from 'react-redux';

import { getCurrentInterviewee } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import { getTranscriptScrollEnabled } from 'modules/interview';
import MediaPlayer from './MediaPlayer';

const mapStateToProps = state => ({
    interviewee: getCurrentInterviewee(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    transcriptScrollEnabled: getTranscriptScrollEnabled(state),
});

export default connect(mapStateToProps)(MediaPlayer);
