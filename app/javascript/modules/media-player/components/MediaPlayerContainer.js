import {connect} from 'react-redux';

import { getProjectId } from 'modules/archive';
import MediaPlayer from './MediaPlayer';

const mapStateToProps = state => ({
    projectId: getProjectId(state),
});

export default connect(mapStateToProps)(MediaPlayer);
