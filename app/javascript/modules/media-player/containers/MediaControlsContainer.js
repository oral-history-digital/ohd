import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview } from 'modules/data';
import { sendTimeChangeRequest } from '../redux/actions';
import { getCurrentTape, getMediaTime } from '../redux/selectors';
import MediaControls from '../components/MediaControls';

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
