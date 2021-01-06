import { connect } from 'react-redux';

import { getLocale } from '../selectors/archiveSelectors';
import { getCurrentInterview, getCurrentProject } from '../selectors/dataSelectors';
import InterviewLoggedOut from '../components/InterviewLoggedOut';

const mapStateToProps = (state) => ({
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(InterviewLoggedOut);
