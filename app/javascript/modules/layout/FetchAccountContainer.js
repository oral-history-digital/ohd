import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { fetchData, deleteData, getCurrentAccount, getProjects,
    getAccountsStatus, getCurrentProject } from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut } from 'modules/account';
import FetchAccount from './FetchAccount';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
    accountsStatus: getAccountsStatus(state),
    isLoggedIn: getIsLoggedIn(state),
    isLoggedOut: getIsLoggedOut(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    locale: getLocale(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FetchAccount);

