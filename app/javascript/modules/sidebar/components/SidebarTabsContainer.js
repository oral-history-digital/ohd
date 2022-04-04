import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId, getProjectId, getSelectedArchiveIds } from 'modules/archive';
import { getCurrentInterview, getCurrentProject, getIsCampscapesProject }
    from 'modules/data';
import { getIsLoggedIn } from 'modules/account';
import { setSidebarTabsIndex } from '../actions';
import { getSidebarIndex } from '../selectors';
import SidebarTabs from './SidebarTabs';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        sidebarTabsIndex: getSidebarIndex(state),
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

const mapDispatchToProps = dispatch => bindActionCreators({
    setSidebarTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SidebarTabs);
