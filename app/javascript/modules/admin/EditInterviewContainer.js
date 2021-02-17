import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import EditInterview from './EditInterview';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        hasMap: project && project.has_map,
    }
}

export default connect(mapStateToProps)(EditInterview);
