import { getCurrentInterview, getCurrentIntervieweeId } from 'modules/data';
import { connect } from 'react-redux';

import PersonData from './PersonData';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
});

export default connect(mapStateToProps)(PersonData);
