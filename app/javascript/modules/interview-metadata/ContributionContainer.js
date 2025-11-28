import { getArchiveId } from 'modules/archive';
import { deleteData, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Contribution from './Contribution';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            deleteData,
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Contribution);
