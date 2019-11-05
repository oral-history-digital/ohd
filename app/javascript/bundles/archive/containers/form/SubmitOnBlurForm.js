import { connect } from 'react-redux';

import SubmitOnBlurForm from '../../components/form/SubmitOnBlurForm';
import { submitData } from '../../actions/dataActionCreators';

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SubmitOnBlurForm);
