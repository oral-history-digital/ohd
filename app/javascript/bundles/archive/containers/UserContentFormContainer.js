import { connect } from 'react-redux';

import UserContentForm from '../components/UserContentForm';
import { submitUserContent } from '../actions/userContentActionCreators';

const mapStateToProps = (state) => {
    return { 
        locale: state.archive.locale,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitUserContent: (params) => dispatch(submitUserContent(params))
})

export default connect(mapStateToProps, mapDispatchToProps)(UserContentForm);
