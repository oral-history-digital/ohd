import { connect } from 'react-redux';

import {
    getCurrentInterview,
    getCurrentIntervieweeId,
    getCurrentProject
} from 'modules/data';
import PersonData from './PersonData';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    intervieweeId: getCurrentIntervieweeId(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(PersonData);
