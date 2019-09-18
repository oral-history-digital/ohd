import { connect } from 'react-redux';

import SegmentEditView from '../components/SegmentEditView';
import { handleSegmentClick } from '../actions/interviewActionCreators';
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
        editView: getCookie('editView')
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: (tape, time, tabIndex) => dispatch(handleSegmentClick(tape, time, tabIndex)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(SegmentEditView);
