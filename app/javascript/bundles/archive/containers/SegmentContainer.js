import { connect } from 'react-redux';

import Segment from '../components/Segment';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    let data = ArchiveUtils.getInterview(state);
    return { 
        transcriptTime: state.archive.transcriptTime,
        locale: state.archive.locale,
        interview: data && data.interview
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: time => dispatch(handleSegmentClick(time)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(Segment);
