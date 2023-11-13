import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getEditView, getTranslations } from 'modules/archive';
import { submitData, getCurrentProject, getCurrentUser,
    getLanguages } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import SingleValueWithForm from './SingleValueWithForm';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
        editView: getEditView(state),
        isLoggedIn: getIsLoggedIn(state),
        translations: getTranslations(state),
        languages: getLanguages(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SingleValueWithForm);
