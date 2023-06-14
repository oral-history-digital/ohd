import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SingleTextInputForm from './SingleTextInputForm';

const mapDispatchToProps = dispatch => bindActionCreators({
    // please NO submitData in here: it would disable
    // this form`s functionality
    // as sub-form
    //submitData,
}, dispatch);

export default connect(undefined, mapDispatchToProps)(SingleTextInputForm);
