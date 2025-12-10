import { setArchiveId } from 'modules/archive';
import { getCurrentUser } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import TaskPreview from './TaskPreview';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            setArchiveId,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(TaskPreview);
