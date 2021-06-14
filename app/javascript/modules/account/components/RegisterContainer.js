import { connect } from 'react-redux';

import Register from './Register';
import { getCurrentProject } from 'modules/data';
import { getLocale, getTranslations } from 'modules/archive';
import { getRegistrationStatus } from '../selectors';

const mapStateToProps = (state) => {
    return {
        registrationStatus: getRegistrationStatus(state),
        translations: getTranslations(state),
        project: getCurrentProject(state),
        locale: getLocale(state),
    }
}

export default connect(mapStateToProps)(Register);
