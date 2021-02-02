import { connect } from 'react-redux';

import FormComponent from './FormComponent';
import { getCurrentProject } from 'modules/data';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.locales) || state.archive.locales,
        translations: state.archive.translations,
    }
}

export default connect(mapStateToProps)(FormComponent);
