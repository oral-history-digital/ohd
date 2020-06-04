import { connect } from 'react-redux';

import Account from '../components/Account';
import { submitLogout } from '../actions/accountActionCreators';
import { changeToEditView } from '../actions/archiveActionCreators';
import { hideFlyoutTabs } from '../actions/flyoutTabsActionCreators';
import { fetchData, deleteData } from '../actions/dataActionCreators';
import { getCookie, getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        translations: state.archive.translations,
        isLoggedIn: state.account.isLoggedIn,
        isLoggedOut: state.account.isLoggedOut,
        firstName: state.account.firstName,
        lastName: state.account.lastName,
        error: state.account.error,
        account: state.data.accounts.current,
        accountsStatus: state.data.statuses.accounts,
        editViewCookie: getCookie('editView'),
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogout: (url) => dispatch(submitLogout(url)),
    changeToEditView: (bool) => dispatch(changeToEditView(bool)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
    fetchData: (props, dataType, archiveId, nestedDataType, extraParams) => dispatch(fetchData(props, dataType, archiveId, nestedDataType, extraParams)),
    deleteData: (props, dataType, id, nestedDataType, nestedId, skipRemove, onlyRemove) => dispatch(deleteData(props, dataType, id, nestedDataType, nestedId, skipRemove, onlyRemove)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);
