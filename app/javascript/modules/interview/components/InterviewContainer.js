import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { setArchiveId, getInterviewEditView } from 'modules/archive';
import { getIsCatalog } from 'modules/data';
import { getCurrentInterview } from 'modules/data';
import Interview from './Interview';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    isCatalog: getIsCatalog(state),
    interviewEditView: getInterviewEditView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
