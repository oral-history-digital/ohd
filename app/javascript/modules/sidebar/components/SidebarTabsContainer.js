import { connect } from 'react-redux';

import { getArchiveId, getProjectId, getSelectedArchiveIds } from 'modules/archive';
import { getCurrentInterview, getCurrentProject, getIsCampscapesProject }
    from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import SidebarTabs from './SidebarTabs';

const mapStateToProps = (state) => {
    return {
        archiveId: getArchiveId(state),
        selectedArchiveIds: getSelectedArchiveIds(state),
        isLoggedIn: getIsLoggedIn(state),
        interview: getCurrentInterview(state),
    }
}

export default connect(mapStateToProps)(SidebarTabs);
