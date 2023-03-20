import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getEditView, getTranslations } from 'modules/archive';
import { submitData, getCurrentProject, getCurrentUser } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import SingleValueWithForm from './SingleValueWithForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        project: getCurrentProject(state),
        user: getCurrentUser(state),
        editView: getEditView(state),
        isLoggedIn: getIsLoggedIn(state),
        translations: getTranslations(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SingleValueWithForm);
