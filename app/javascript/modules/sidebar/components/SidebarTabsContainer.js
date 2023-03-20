import { connect } from 'react-redux';

import { getArchiveId, getProjectId, getSelectedArchiveIds } from 'modules/archive';
import { getCurrentInterview, getCurrentProject, getIsCampscapesProject }
    from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import SidebarTabs from './SidebarTabs';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        archiveId: getArchiveId(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        selectedArchiveIds: getSelectedArchiveIds(state),
        hasMap: project && project.has_map === 1,
        isLoggedIn: getIsLoggedIn(state),
        interview: getCurrentInterview(state),
        isCampscapesProject: getIsCampscapesProject(state),
    }
}

export default connect(mapStateToProps)(SidebarTabs);
