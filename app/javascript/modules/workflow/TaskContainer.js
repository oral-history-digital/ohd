import { getEditView } from 'modules/archive';
import { getCurrentUser, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Task from './Task';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
        editView: getEditView(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Task);
