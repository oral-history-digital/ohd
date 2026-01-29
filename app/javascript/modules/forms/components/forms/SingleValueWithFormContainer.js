import { getEditView } from 'modules/archive';
import { getCurrentUser, submitData } from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SingleValueWithForm from './SingleValueWithForm';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
        editView: getEditView(state),
        isLoggedIn: getIsLoggedIn(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            submitData,
        },
        dispatch
    );

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SingleValueWithForm);
