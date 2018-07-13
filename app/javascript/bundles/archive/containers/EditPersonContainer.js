import { connect } from 'react-redux';

import EditPerson from '../components/EditPerson';
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

export default connect(mapStateToProps, mapDispatchToProps)(EditPerson);
