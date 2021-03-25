import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getSelectedInterviewEditViewColumns, getEditView } from 'modules/archive';
import { sendTimeChangeRequest } from 'modules/media-player';
import { getCurrentInterview } from 'modules/data';
import SegmentEditView from './SegmentEditView';

const mapStateToProps = (state) => ({
    locale: getLocale(state),
    interview: getCurrentInterview(state),
    statuses: state.data.statuses.segments,
    account: state.data.accounts.current,
    selectedInterviewEditViewColumns: getSelectedInterviewEditViewColumns(state),
    editView: getEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendTimeChangeRequest,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SegmentEditView);
