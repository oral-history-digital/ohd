import { getCountryKeys } from 'modules/archive';
import { getProjectId } from 'modules/archive';
import { getCurrentUser, submitData } from 'modules/data';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CorrectUserDataForm from './CorrectUserDataForm';

const mapStateToProps = (state) => {
    return {
        currentUser: getCurrentUser(state),
        projectId: getProjectId(state),
        countryKeys: getCountryKeys(state),
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
)(CorrectUserDataForm);
