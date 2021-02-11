import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentInterview } from 'modules/data';
import { setInterviewTabIndex, getTabIndex } from 'modules/video-player';
import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import InterviewTabs from './InterviewTabs';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    locale: getLocale(state),
    translations: getTranslations(state),
    projectId: getProjectId(state),
    tabIndex: getTabIndex(state),
    interviewSearchResults: state.search.interviews[getArchiveId(state)],
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setInterviewTabIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(InterviewTabs);
