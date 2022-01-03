import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { changeToEditView, getLocale, getArchiveId, getProjectId, getTranslations, getEditView } from 'modules/archive';
import { hideSidebar } from 'modules/sidebar';
import { getCookie } from 'modules/persistence';
import { clearStateData, getCurrentProject, getProjects, getCurrentAccount } from 'modules/data';
import { submitLogout } from '../actions';
import { clearSearch } from 'modules/search';
import { getFirstName, getIsLoggedIn, getLastName, getLoginError } from '../selectors';
import Account from './Account';

const mapStateToProps = (state) => {
    return {
        archiveId: getArchiveId(state),
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        project: getCurrentProject(state),
        translations: getTranslations(state),
        firstName: getFirstName(state),
        lastName: getLastName(state),
        error: getLoginError(state),
        account: getCurrentAccount(state),
        isLoggedIn: getIsLoggedIn(state),
        editViewCookie: getCookie('editView') === 'true',
        editView: getEditView(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitLogout,
    changeToEditView,
    hideSidebar,
    clearStateData,
    clearSearch,
}, dispatch);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Account));
