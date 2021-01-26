import { connect } from 'react-redux';

import RegisterForm from './RegisterForm';
import { submitRegister } from '../actions';
import { getProject } from 'lib/utils';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        projectId: state.archive.projectId,
        projects: state.data.projects,
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
