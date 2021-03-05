import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeToEditView } from 'modules/archive';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { getCookie } from 'modules/persistence';
import { getCurrentProject } from 'modules/data';
import { submitLogout } from '../actions';
import Account from './Account';
import { getFirstName, getIsLoggedIn, getLastName, getLoginError } from '../selectors';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        project: getCurrentProject(state),
        translations: state.archive.translations,
        firstName: getFirstName(state),
        lastName: getLastName(state),
        error: getLoginError(state),
        account: state.data.accounts.current,
        isLoggedIn: getIsLoggedIn(state),
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
