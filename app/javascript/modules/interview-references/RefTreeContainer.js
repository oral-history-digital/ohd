import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentProject, getCurrentInterview, getCurrentRefTree,
    getCurrentRefTreeStatus } from 'modules/data';
import {
    getArchiveId,
    getLocale,
    getProjectId
} from 'modules/archive';
import RefTree from './RefTree';

const mapStateToProps = state => ({
    locale: getLocale(state),
    interview: getCurrentInterview(state),
    projectId: getProjectId(state),
    project: getCurrentProject(state),
    archiveId: getArchiveId(state),
    refTree: getCurrentRefTree(state),
    refTreeStatus: getCurrentRefTreeStatus(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
