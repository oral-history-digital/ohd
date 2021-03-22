import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { sendTimeChangeRequest, getCurrentTape, getMediaTime } from 'modules/media-player';
import SubHeading from './SubHeading';

const mapStateToProps = (state, ownProps) => {
    const endTime = (ownProps.nextSubHeading) ? ownProps.nextSubHeading.time : ownProps.data.duration;
    const tape = getCurrentTape(state);
    const mediaTime = getMediaTime(state);
    const active = tape === ownProps.data.tape_nbr && endTime >= mediaTime && ownProps.data.time <= mediaTime;

    return { active };
};

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SubHeading);
