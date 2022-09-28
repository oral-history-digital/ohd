import {connect} from 'react-redux';

import { getCurrentInterviewee } from 'modules/data';
import { getProjectId } from 'modules/archive';
import MediaPlayer from './MediaPlayer';

const mapStateToProps = state => ({
    interviewee: getCurrentInterviewee(state),
    projectId: getProjectId(state),
});

export default connect(mapStateToProps)(MediaPlayer);
