import { getArchiveId } from 'modules/archive';
import {
    fetchData,
    getCurrentRefTree,
    getCurrentRefTreeStatus,
} from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import RefTree from './RefTree';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
    refTree: getCurrentRefTree(state),
    refTreeStatus: getCurrentRefTreeStatus(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            fetchData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
