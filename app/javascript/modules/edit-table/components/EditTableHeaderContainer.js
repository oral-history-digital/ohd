import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';

import EditTableHeader from './EditTableHeader';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(EditTableHeader);
