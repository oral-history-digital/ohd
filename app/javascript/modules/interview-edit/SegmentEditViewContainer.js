import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setTapeAndTime } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import SegmentEditView from './SegmentEditView';

const mapStateToProps = (state) => ({
    locale: state.archive.locale,
    interview: getCurrentInterview(state),
    statuses: state.data.statuses.segments,
    account: state.data.accounts.current,
    selectedInterviewEditViewColumns: state.archive.selectedInterviewEditViewColumns,
    editView: state.archive.editView,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setTapeAndTime,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SegmentEditView);
