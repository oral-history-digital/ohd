import { connect } from 'react-redux';

import { getLocale, getProjectId, getEditView, getTranslations } from 'modules/archive';
import { submitData } from 'modules/data';
import SingleValueWithForm from './SingleValueWithForm';

const mapStateToProps = (state) => {
    return {
        locale: getLocale(state),
        projectId: getProjectId(state),
        projects: state.data.projects,
        account: state.data.accounts.current,
        editView: getEditView(state),
        isLoggedIn: state.account.isLoggedIn,
        translations: getTranslations(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params, opts) => dispatch(submitData(props, params, opts))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleValueWithForm);
