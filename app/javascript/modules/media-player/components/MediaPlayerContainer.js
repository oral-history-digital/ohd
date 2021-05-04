import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterviewee } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import { setSticky, unsetSticky } from '../actions';
import { getSticky } from '../selectors';
import MediaPlayer from './MediaPlayer';

const mapStateToProps = state => ({
    interviewee: getCurrentInterviewee(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
    sticky: getSticky(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setSticky,
    unsetSticky,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaPlayer);
