import { connect } from 'react-redux';

import RegisterForm from '../components/RegisterForm';
import { submitRegister } from '../actions/accountActionCreators';
import { getProject } from '../../../lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return { 
        projectId: state.archive.projectId,
        locale: state.archive.locale,
        translations: state.archive.translations,
        countryKeys: state.archive.countryKeys,
        externalLinks: project && project.external_links,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitRegister: (url, params) => dispatch(submitRegister(url, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);