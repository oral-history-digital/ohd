import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteWorkbook  } from '../actions';
import UserContentDelete from './UserContentDelete';

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteWorkbook,
}, dispatch);

export default connect(null, mapDispatchToProps)(UserContentDelete);
