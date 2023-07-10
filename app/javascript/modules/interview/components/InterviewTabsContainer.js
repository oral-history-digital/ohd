import {connect} from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import InterviewTabs from './InterviewTabs';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
});

export default connect(mapStateToProps)(InterviewTabs);
