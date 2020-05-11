import { connect } from 'react-redux';

import SingleValueWithForm from '../components/SingleValueWithForm';
import { submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        account: state.data.accounts.current,
        editView: state.archive.editView,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params))
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleValueWithForm);
