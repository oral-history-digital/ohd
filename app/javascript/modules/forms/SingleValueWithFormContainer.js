import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getEditView, getTranslations } from 'modules/archive';
import { submitData, getCurrentProject, getCurrentAccount } from 'modules/data';
import { getIsLoggedIn } from 'modules/account';
import SingleValueWithForm from './SingleValueWithForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        isLoggedIn: getIsLoggedIn(state),
        translations: getTranslations(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SingleValueWithForm);
