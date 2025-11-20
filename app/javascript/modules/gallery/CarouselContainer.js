import { connect } from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import Carousel from './Carousel';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(Carousel);
