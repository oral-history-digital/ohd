import { connect } from 'react-redux';

import Register from './Register';
import { getProject } from 'lib/utils';
import { getRegistrationStatus } from '../selectors';

const mapStateToProps = (state) => {
    let project = getProject(state);

    return {
        registrationStatus: getRegistrationStatus(state),
        translations: state.archive.translations,
        externalLinks: project && project.external_links,
        locale: state.archive.locale
    }
}

export default connect(mapStateToProps)(Register);
