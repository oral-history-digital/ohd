import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getLocale, getProjectId, getTranslations, getCountryKeys } from 'modules/archive';
import { getCurrentProject, getProjects } from 'modules/data';
import { submitRegister } from '../actions';
import RegisterForm from './RegisterForm';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        projectId: getProjectId(state),
        projects: getProjects(state),
        locale: getLocale(state),
        translations: getTranslations(state),
        countryKeys: getCountryKeys(state),
        externalLinks: project && project.external_links,
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    submitRegister,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
