import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { deleteWorkbook  } from '../actions';
import WorkbookItemDelete from './WorkbookItemDelete';

const mapDispatchToProps = dispatch => bindActionCreators({
    deleteWorkbook,
}, dispatch);

export default connect(null, mapDispatchToProps)(WorkbookItemDelete);
