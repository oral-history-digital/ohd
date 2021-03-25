import { connect } from 'react-redux';

import { getLocale, getProjectId, getTranslations, getCountryKeys } from 'modules/archive';
import { getCurrentProject } from 'modules/data';
import { submitRegister } from '../actions';
import RegisterForm from './RegisterForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        projectId: getProjectId(state),
        projects: state.data.projects,
        locale: getLocale(state),
        translations: getTranslations(state),
        countryKeys: getCountryKeys(state),
        externalLinks: project && project.external_links,
    }
}

const mapDispatchToProps = (dispatch) => ({
    submitRegister: (url, params) => dispatch(submitRegister(url, params)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
