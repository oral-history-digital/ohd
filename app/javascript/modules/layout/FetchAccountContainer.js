import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId } from 'modules/archive';
import { fetchData, deleteData, getCurrentAccount,
    getAccountsStatus, getCurrentProject } from 'modules/data';
import { getIsLoggedIn, getIsLoggedOut, getCheckedOhdSession } from 'modules/account';
import FetchAccount from './FetchAccount';

const mapStateToProps = state => ({
    account: getCurrentAccount(state),
    accountsStatus: getAccountsStatus(state),
    isLoggedIn: getIsLoggedIn(state),
    isLoggedOut: getIsLoggedOut(state),
    checkedOhdSession: getCheckedOhdSession(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    locale: getLocale(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    deleteData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FetchAccount);

