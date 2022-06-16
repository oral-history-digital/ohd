import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview } from 'modules/data';
import { setTape } from '../actions';
import { getCurrentTape, getMediaTime } from '../selectors';
import MediaControls from './MediaControls';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTape,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MediaControls);
