import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentInterview, getCurrentInterviewee,
    getCurrentProject, getPeople, getProjects } from 'modules/data';
import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import { getIsLoggedIn } from 'modules/account';
import PersonData from './PersonData';

const mapStateToProps = state => ({
    locale: getLocale(state),
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    interview: getCurrentInterview(state),
    interviewee: getCurrentInterviewee(state),
    people: getPeople(state),
    isLoggedIn: getIsLoggedIn(state),
    project: getCurrentProject(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PersonData);
