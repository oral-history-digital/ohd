import { getCurrentInterview } from 'modules/data';
import { connect } from 'react-redux';

import InterviewTabs from './InterviewTabs';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(InterviewTabs);
