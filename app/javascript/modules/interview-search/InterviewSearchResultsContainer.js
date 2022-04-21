import { connect } from 'react-redux';

import { getCurrentProject, getCurrentInterview } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import InterviewSearchResults from './InterviewSearchResults';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    interview: getCurrentInterview(state),
    project: getCurrentProject(state),
});

export default connect(mapStateToProps)(InterviewSearchResults);
