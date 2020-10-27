import { connect } from 'react-redux';

import SegmentEditView from '../components/SegmentEditView';
import { setTapeAndTime } from '../actions/interviewActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

import { getInterview, getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        transcriptTime: state.archive.transcriptTime,
        locale: state.archive.locale,
        tape: state.archive.tape,
        interview: getInterview(state),
        statuses: state.data.statuses.segments,
        account: state.data.accounts.current,
        selectedInterviewEditViewColumns: state.archive.selectedInterviewEditViewColumns,
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    setTapeAndTime: (tape, time) => dispatch(setTapeAndTime(tape, time)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(SegmentEditView);
