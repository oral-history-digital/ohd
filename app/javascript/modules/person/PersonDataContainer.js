import { connect } from 'react-redux';

import {
    getCurrentInterview,
    getCurrentIntervieweeId,
} from 'modules/data';
import PersonData from './PersonData';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
});

export default connect(mapStateToProps)(PersonData);
