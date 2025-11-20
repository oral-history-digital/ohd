import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';

import Carousel from './Carousel';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(Carousel);
