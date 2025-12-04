import {
    getCurrentTape,
    getMediaTime,
    sendTimeChangeRequest,
} from 'modules/media-player';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Subheading from './Subheading';
import isHeadingActive from './isHeadingActive';

const mapStateToProps = (state, ownProps) => {
    const active = isHeadingActive({
        thisHeadingTape: ownProps.data.tape_nbr,
        thisHeadingTime: ownProps.data.time,
        nextHeadingTape: ownProps.nextSubHeading?.tape_nbr,
        nextHeadingTime: ownProps.nextSubHeading?.time,
        currentTape: getCurrentTape(state),
        currentTime: getMediaTime(state),
    });

    return { active };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            sendTimeChangeRequest,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Subheading);
