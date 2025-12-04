import {
    getCurrentInterview,
    getCurrentUser,
    getIsCatalog,
} from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut } from 'modules/user';
import { connect } from 'react-redux';

import AuthShow from './AuthShow';

const mapStateToProps = (state) => ({
    isLoggedIn: getIsLoggedIn(state),
    isLoggedOut: getIsLoggedOut(state),
    user: getCurrentUser(state),
    interview: getCurrentInterview(state),
    isCatalog: getIsCatalog(state),
});

export default connect(mapStateToProps)(AuthShow);
