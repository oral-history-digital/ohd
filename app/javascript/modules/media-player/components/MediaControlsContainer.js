import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview } from 'modules/data';
import { setTape } from '../redux/actions';
import { getCurrentTape, getMediaTime } from '../redux/selectors';
import MediaControls from './MediaControls';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setTape,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(MediaControls);
