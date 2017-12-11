import { connect } from 'react-redux';

import RefTree from '../components/RefTree';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    let interview = ArchiveUtils.getInterview(state);
    return { 
        archiveId: state.archive.archiveId,
        refTree: interview && interview.refTree || []
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
