import { connect } from 'react-redux';

import { getCurrentProject, getCurrentAccount } from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut } from 'modules/account';
import { getProjectId } from 'modules/archive';
import AuthShow from './AuthShow';

const mapStateToProps = (state) => ({
    isLoggedIn: getIsLoggedIn(state),
    isLoggedOut: getIsLoggedOut(state),
    account: getCurrentAccount(state),
    project: getCurrentProject(state),
    projectId: getProjectId(state),
});

export default connect(mapStateToProps)(AuthShow);
