import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { openArchivePopup } from 'modules/ui';
import { setTapeAndTime } from 'modules/interview';
import { getCurrentInterview } from 'modules/data';
import SegmentEditView from './SegmentEditView';

const mapStateToProps = (state) => ({
    transcriptTime: state.archive.transcriptTime,
    locale: state.archive.locale,
    interview: getCurrentInterview(state),
    statuses: state.data.statuses.segments,
    account: state.data.accounts.current,
    selectedInterviewEditViewColumns: state.archive.selectedInterviewEditViewColumns,
    editView: state.archive.editView,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTapeAndTime,
    openArchivePopup,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SegmentEditView);
