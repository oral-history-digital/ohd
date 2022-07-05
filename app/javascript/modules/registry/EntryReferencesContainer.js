import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getInterviews, getProjects, fetchData } from 'modules/data';
import { setArchiveId, getLocale, getProjectId } from 'modules/archive';
import { getIsLoggedIn } from 'modules/account';
import EntryReferences from './EntryReferences';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    interviews: getInterviews(state),
    isLoggedIn: getIsLoggedIn(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    setArchiveId,
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EntryReferences);

