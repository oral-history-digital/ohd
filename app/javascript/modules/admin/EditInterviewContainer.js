import { connect } from 'react-redux';

import { getCurrentProject } from 'modules/data';
import { getLocale, getLocales, getTranslations } from 'modules/archive';
import EditInterview from './EditInterview';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: getLocale(state),
        locales: (project && project.available_locales) || getLocales(state),
        translations: getTranslations(state),
        hasMap: project && project.has_map,
    }
}

export default connect(mapStateToProps)(EditInterview);
