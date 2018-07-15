import { connect } from 'react-redux';

import PersonForm from '../components/PersonForm';
import { submitData } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (params, locale) => dispatch(submitData(params, locale))
})

export default connect(mapStateToProps, mapDispatchToProps)(PersonForm);
