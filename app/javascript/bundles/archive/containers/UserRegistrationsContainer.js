import { connect } from 'react-redux';

import UserRegistrations from '../components/UserRegistrations';
//import { returnToForm } from '../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
        locales: state.archive.locales,
        translations: state.archive.translations,
    }
}

const mapDispatchToProps = (dispatch) => ({
    //returnToForm: (dataType) => dispatch(returnToForm(dataType))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserRegistrations);
