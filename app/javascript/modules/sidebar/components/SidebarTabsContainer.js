import { connect } from 'react-redux';

import { getArchiveId, getSelectedArchiveIds } from 'modules/archive';
import { getCurrentInterview } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import SidebarTabs from './SidebarTabs';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    selectedArchiveIds: getSelectedArchiveIds(state),
    isLoggedIn: getIsLoggedIn(state),
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(SidebarTabs);
