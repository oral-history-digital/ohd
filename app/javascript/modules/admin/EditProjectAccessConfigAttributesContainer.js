import { submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import EditData from './EditData';

const mapStateToProps = (state) => ({
    scope: 'access_config',
    helpTextCode: 'access_config_form',
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({ submitData }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EditData);
