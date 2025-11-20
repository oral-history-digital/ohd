import {
    deleteData,
    fetchData,
    getCurrentUser,
    getUsersStatus,
} from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut } from 'modules/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FetchAccount from './FetchAccount';

const mapStateToProps = (state) => ({
    user: getCurrentUser(state),
    usersStatus: getUsersStatus(state),
    isLoggedIn: getIsLoggedIn(state),
    isLoggedOut: getIsLoggedOut(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
            deleteData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(FetchAccount);
