import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setFlyoutTabsIndex } from 'modules/flyout-tabs';
import { setArchiveId, getInterviewEditView, getProjectId, getLocale } from 'modules/archive';
import { getCurrentInterview, getCurrentInterviewFetched, getIsCatalog, getProjects,
    fetchData } from 'modules/data';
import Interview from './Interview';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    interviewIsFetched: getCurrentInterviewFetched(state),
    isCatalog: getIsCatalog(state),
    interviewEditView: getInterviewEditView(state),
    projectId: getProjectId(state),
    locale: getLocale(state),
    projects: getProjects(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    setArchiveId,
    setFlyoutTabsIndex,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Interview);
