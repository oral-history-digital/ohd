import { connect } from 'react-redux';

import { getProject } from 'lib/utils';
import EditInterview from './EditInterview';

const mapStateToProps = (state) => {
    let project = getProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.available_locales) || state.archive.locales,
        translations: state.archive.translations,
        hasMap: project && project.has_map,
    }
}

export default connect(mapStateToProps)(EditInterview);
