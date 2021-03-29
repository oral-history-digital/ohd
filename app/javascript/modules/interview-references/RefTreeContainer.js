import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getProjects, getCurrentInterview, getRefTreeStatus } from 'modules/data';
import { getArchiveId, getLocale, getProjectId, getTranslations } from 'modules/archive';
import RefTree from './RefTree';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    refTreeStatus: getRefTreeStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
