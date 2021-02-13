import { connect } from 'react-redux';

import SingleValueWithForm from '../components/SingleValueWithForm';
import { submitData } from 'modules/data';

const mapStateToProps = (state) => {
    return {
        locale: state.archive.locale,
        projectId: state.archive.projectId,
        projects: state.data.projects,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        isLoggedIn: state.account.isLoggedIn,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params, opts) => dispatch(submitData(props, params, opts))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleValueWithForm);
