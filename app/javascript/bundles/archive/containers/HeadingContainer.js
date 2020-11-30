import { connect } from 'react-redux';

import Heading from '../components/Heading';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

const mapStateToProps = state => ({
    locale: state.archive.locale,
    transcriptTime: state.interview.transcriptTime,
    tape: state.interview.tape,
});

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Heading);
