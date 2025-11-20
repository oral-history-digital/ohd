import { connect } from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import Gallery from './Gallery';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(Gallery);
