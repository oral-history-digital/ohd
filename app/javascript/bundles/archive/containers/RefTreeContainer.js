import { connect } from 'react-redux';

import RefTree from '../components/RefTree';

import ArchiveUtils from '../../../lib/utils';

const mapStateToProps = (state) => {
    return { 
        archiveId: state.archive.archiveId,
        data: ArchiveUtils.getInterview(state),
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(RefTree);
