import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getArchiveId, getProjectId } from 'modules/archive';
import { hideSidebar } from 'modules/sidebar';
import { clearStateData, getCurrentProject, getProjects, getCurrentUser } from 'modules/data';
import { submitLogout } from '../actions';
import { getFirstName, getIsLoggedIn, getLastName, getLoginError, getIsRegistered } from '../selectors';
import Account from './Account';

const mapStateToProps = (state) => {
    return {
        archiveId: getArchiveId(state),
        projects: getProjects(state),
        projectId: getProjectId(state),
        firstName: getFirstName(state),
        lastName: getLastName(state),
        error: getLoginError(state),
        user: getCurrentUser(state),
        isLoggedIn: getIsLoggedIn(state),
        isRegistered: getIsRegistered(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitLogout,
    hideSidebar,
    clearStateData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Account);
