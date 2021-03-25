import { connect } from 'react-redux';

import { getLocale, getProjectId, getEditView, getTranslations } from 'modules/archive';
import { submitData, getProjects, getCurrentAccount } from 'modules/data';
import SingleValueWithForm from './SingleValueWithForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: getProjects(state),
        account: getCurrentAccount(state),
        editView: getEditView(state),
        isLoggedIn: state.account.isLoggedIn,
        translations: getTranslations(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params, opts) => dispatch(submitData(props, params, opts))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleValueWithForm);
