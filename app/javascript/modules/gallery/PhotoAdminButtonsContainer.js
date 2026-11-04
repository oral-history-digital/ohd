import { getArchiveId } from 'modules/archive';
import { deleteData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import PhotoAdminButtons from './PhotoAdminButtons';

const mapStateToProps = (state) => ({
    archiveId: getArchiveId(state),
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            deleteData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAdminButtons);
