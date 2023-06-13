import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchData, getCurrentInterview, getCurrentRefTree,
    getCurrentRefTreeStatus } from 'modules/data';
import { getArchiveId } from 'modules/archive';
import RefTree from './RefTree';

const mapStateToProps = state => ({
    interview: getCurrentInterview(state),
    archiveId: getArchiveId(state),
    refTree: getCurrentRefTree(state),
    refTreeStatus: getCurrentRefTreeStatus(state)
});

const mapDispatchToProps = dispatch => bindActionCreators({
    fetchData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
