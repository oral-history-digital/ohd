import { connect } from 'react-redux';

import Register from './Register';
import { getCurrentProject } from 'modules/data';
import { getLocale, getTranslations } from 'modules/archive';
import { getRegistrationStatus } from '../selectors';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);

    return {
        registrationStatus: getRegistrationStatus(state),
        translations: getTranslations(state),
        externalLinks: project && project.external_links,
        locale: getLocale(state),
    }
}

export default connect(mapStateToProps)(Register);
