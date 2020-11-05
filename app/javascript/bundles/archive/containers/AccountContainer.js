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
        firstName: state.account.firstName,
        lastName: state.account.lastName,
        error: state.account.error,
        account: state.data.accounts.current,
        editViewCookie: getCookie('editView') === 'true',
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogout: (url) => dispatch(submitLogout(url)),
    changeToEditView: (bool) => dispatch(changeToEditView(bool)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Account);
