import { connect } from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(InterviewSearchResults);
