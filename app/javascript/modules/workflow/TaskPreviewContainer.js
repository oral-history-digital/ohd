import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentUser } from 'modules/data';
import TaskPreview from './TaskPreview';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(TaskPreview);
