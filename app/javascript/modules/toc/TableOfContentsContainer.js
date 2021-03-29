import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentInterview, getProjects, getHeadingsStatus } from 'modules/data';
import { getLocale, getProjectId, getTranslations, getArchiveId } from 'modules/archive';
import TableOfContents from './TableOfContents';

const mapStateToProps = state => ({
    locale: getLocale(state),
    projectId: getProjectId(state),
    projects: getProjects(state),
    translations: getTranslations(state),
    archiveId: getArchiveId(state),
    interview: getCurrentInterview(state),
    headingsStatus: getHeadingsStatus(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TableOfContents);
