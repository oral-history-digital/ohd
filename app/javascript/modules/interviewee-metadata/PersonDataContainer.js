import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, fetchData, getCurrentInterview, getCurrentInterviewee,
    getCurrentProject, getPeopleForCurrentProject, getProjects, getCurrentAccount } from 'modules/data';
import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import PersonData from './PersonData';
import { getIsLoggedIn } from 'modules/account';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    interview: getCurrentInterview(state),
    interviewee: getCurrentInterviewee(state),
    people: getPeopleForCurrentProject(state),
    account: getCurrentAccount(state),
    project: getCurrentProject(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
    submitData
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PersonData);
