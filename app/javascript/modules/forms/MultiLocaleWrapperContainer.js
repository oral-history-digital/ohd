import { connect } from 'react-redux';

import { getCurrentProject } from 'bundles/archive/selectors/dataSelectors';
import MultiLocaleWrapper from './MultiLocaleWrapper';

const mapStateToProps = (state) => {
    let project = getCurrentProject(state);
    return {
        locale: state.archive.locale,
        locales: (project && project.locales) || state.archive.locales,
        translations: state.archive.translations,
    }
}

export default connect(mapStateToProps)(MultiLocaleWrapper);
