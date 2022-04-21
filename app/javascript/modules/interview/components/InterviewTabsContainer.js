import {connect} from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import { getLocale, getProjectId } from 'modules/archive';
import InterviewTabs from './InterviewTabs';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    projectId: getProjectId(state),
});

export default connect(mapStateToProps)(InterviewTabs);
