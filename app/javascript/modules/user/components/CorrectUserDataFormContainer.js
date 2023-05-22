import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCountryKeys } from 'modules/archive';
import { submitData, getCurrentUser, getCurrentProject } from 'modules/data';
import { getProjectId } from 'modules/archive';
import CorrectUserDataForm from './CorrectUserDataForm';

const mapStateToProps = (state) => {
    return {
        project: getCurrentProject(state),
        currentUser: getCurrentUser(state),
        projectId: getProjectId(state),
        countryKeys: getCountryKeys(state),
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CorrectUserDataForm);
