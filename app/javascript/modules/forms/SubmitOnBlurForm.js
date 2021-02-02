import { connect } from 'react-redux';

import SubmitOnBlurFormComponent from './SubmitOnBlurFormComponent';
import { submitData } from 'modules/data';

const mapDispatchToProps = (dispatch) => ({
    submitData: (props, params) => dispatch(submitData(props, params)),
})

export default connect(null, mapDispatchToProps)(SubmitOnBlurFormComponent);
