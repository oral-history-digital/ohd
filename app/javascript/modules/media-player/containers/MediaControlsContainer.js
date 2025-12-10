import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MediaControls from '../components/MediaControls';
import { sendTimeChangeRequest } from '../redux/actions';
import { getCurrentTape, getMediaTime } from '../redux/selectors';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    tape: getCurrentTape(state),
    mediaTime: getMediaTime(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            sendTimeChangeRequest,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(MediaControls);
