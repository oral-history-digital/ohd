import { connect } from 'react-redux';

import { getLocale } from 'modules/archive';
import { getCurrentInterview, getCurrentProject } from 'modules/data';
import InterviewLoggedOut from '../components/InterviewLoggedOut';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(InterviewLoggedOut);
