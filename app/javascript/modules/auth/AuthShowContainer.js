import { connect } from 'react-redux';

import { getCurrentProject, getCurrentUser, getIsCatalog } from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut } from 'modules/user';
import AuthShow from './AuthShow';

const mapStateToProps = (state) => ({
    isLoggedIn: getIsLoggedIn(state),
    isLoggedOut: getIsLoggedOut(state),
    user: getCurrentUser(state),
    project: getCurrentProject(state),
    isCatalog: getIsCatalog(state),
});

export default connect(mapStateToProps)(AuthShow);
