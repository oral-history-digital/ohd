import { connect } from 'react-redux';

import { getCurrentProject, getCurrentAccount, getIsCatalog } from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut } from 'modules/account';
import AuthShow from './AuthShow';

const mapStateToProps = (state) => ({
    isLoggedIn: getIsLoggedIn(state),
    isLoggedOut: getIsLoggedOut(state),
    account: getCurrentAccount(state),
    project: getCurrentProject(state),
    isCatalog: getIsCatalog(state),
});

export default connect(mapStateToProps)(AuthShow);
