import { connect } from 'react-redux';

import Segment from '../components/Segment';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

import { getInterview } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        transcriptTime: state.archive.transcriptTime,
        locale: state.archive.locale,
        tape: state.archive.tape,
        interview: getInterview(state),
        userContents: state.data.user_contents,
        statuses: state.data.statuses.segments,
        account: state.account,
        editView: state.archive.editView
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time) => dispatch(handleSegmentClick(tape, time)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
