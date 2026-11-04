import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';

import EditTableRow from './EditTableRow';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(EditTableRow);
