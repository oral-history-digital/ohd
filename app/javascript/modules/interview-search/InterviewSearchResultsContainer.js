import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';

import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(InterviewSearchResults);
