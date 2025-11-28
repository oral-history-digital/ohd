import { getEditView } from 'modules/archive';
import {
    getCurrentProject,
    getCurrentUser,
    getLanguages,
    submitData,
} from 'modules/data';
import { getIsLoggedIn } from 'modules/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SingleValueWithForm from './SingleValueWithForm';

const mapStateToProps = (state) => {
    return {
        user: getCurrentUser(state),
        editView: getEditView(state),
        isLoggedIn: getIsLoggedIn(state),
        languages: getLanguages(state),
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
