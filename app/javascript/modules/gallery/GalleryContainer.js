import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';

import Gallery from './Gallery';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(Gallery);
