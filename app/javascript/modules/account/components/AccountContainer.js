import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeToEditView, getLocale, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { hideFlyoutTabs } from 'modules/flyout-tabs';
import { getCookie } from 'modules/persistence';
import { getCurrentProject } from 'modules/data';
import { submitLogout } from '../actions';
import { getFirstName, getIsLoggedIn, getLastName, getLoginError } from '../selectors';
import Account from './Account';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        project: getCurrentProject(state),
        translations: getTranslations(state),
        firstName: getFirstName(state),
        lastName: getLastName(state),
        error: getLoginError(state),
        account: state.data.accounts.current,
        isLoggedIn: getIsLoggedIn(state),
        editViewCookie: getCookie('editView') === 'true',
        editView: getEditView(state),
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
