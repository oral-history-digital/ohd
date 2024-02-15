import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { submitData, getCurrentUser } from 'modules/data';
import { getEditView } from 'modules/archive';
import Task from './Task';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
        editView: getEditView(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Task);
