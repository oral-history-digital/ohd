import { connect } from 'react-redux';

import Interview from '../components/Interview';
import { setArchiveId } from '../actions/archiveActionCreators';
import { setFlyoutTabsIndex } from '../actions/flyoutTabsActionCreators';
import { getInterviewEditView } from '../selectors/archiveSelectors';
import { getIsCatalog } from '../selectors/projectSelectors';

const mapStateToProps = (state) => ({
    isCatalog: getIsCatalog(state),
    interviewEditView: getInterviewEditView(state),
});

const mapDispatchToProps = (dispatch) => ({
    setArchiveId: (archiveId) => dispatch(setArchiveId(archiveId)),
    setFlyoutTabsIndex: index => dispatch(setFlyoutTabsIndex(index)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
