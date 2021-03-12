import { connect } from 'react-redux';

import { handleSegmentClick, getCurrentTape, getMediaTime } from 'modules/media-player';
import Heading from './Heading';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    mediaTime: getMediaTime(state),
    tape: getCurrentTape(state),
});

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Heading);
