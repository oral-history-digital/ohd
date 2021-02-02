import { connect } from 'react-redux';

import Interview from '../components/Interview';
import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { setArchiveId, getInterviewEditView } from 'modules/archive';
import { getIsCatalog } from 'modules/data';
import { getCurrentInterview } from 'modules/data';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    isCatalog: getIsCatalog(state),
    interviewEditView: getInterviewEditView(state),
});

const mapDispatchToProps = (dispatch) => ({
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
