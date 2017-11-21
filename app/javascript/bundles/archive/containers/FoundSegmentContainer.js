import { connect } from 'react-redux';

import FoundSegment from '../components/FoundSegment';
import { handleSegmentClick } from '../actions/interviewActionCreators';
import { openArchivePopup } from '../actions/archivePopupActionCreators';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    let data = ArchiveUtils.getInterview(state);
    return { 
        transcriptTime: state.archive.transcriptTime,
        locale: state.archive.locale,
        interview: data && data.interview,
        references: data && data.references
    }
}

const mapDispatchToProps = (dispatch) => ({
    handleSegmentClick: time => dispatch(handleSegmentClick(time)),
    openArchivePopup: (params) => dispatch(openArchivePopup(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(FoundSegment);
