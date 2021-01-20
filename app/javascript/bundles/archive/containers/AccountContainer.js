import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Account from '../components/Account';
import { submitLogout } from '../actions/accountActionCreators';
import { changeToEditView } from '../actions/archiveActionCreators';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { getCookie } from '../../../lib/utils';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        translations: state.archive.translations,
        firstName: state.account.firstName,
        lastName: state.account.lastName,
        error: state.account.error,
        account: state.data.accounts.current,
        isLoggedIn: state.account.isLoggedIn,
        editViewCookie: getCookie('editView') === 'true',
        editView: state.archive.editView,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitLogout: (url) => dispatch(submitLogout(url)),
    changeToEditView: (bool) => dispatch(changeToEditView(bool)),
    hideFlyoutTabs: () => dispatch(hideFlyoutTabs()),
})

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Account));
